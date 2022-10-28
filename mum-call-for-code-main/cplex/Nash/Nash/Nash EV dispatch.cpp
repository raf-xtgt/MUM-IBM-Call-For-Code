#include "Header.h"
int main() {

    IloEnv env;

    std::filesystem::create_directories("nash profit maximization");
    std::filesystem::path cFile = std::filesystem::current_path();
    string cwd = cFile.string();
    std::replace(cwd.begin(), cwd.end(), '\\', '/');
    char* fileConfig   = fileName(cwd, "Market Parameter");
    char *fileLocEV    = fileName(cwd, "EV contract");
    char *fileLocPro   = fileName(cwd, "Power Consumption - BFM");
    char *fileLocSolar = fileName(cwd, "Solar");

    std::vector<int> time, listEV;
    IloInt nbCS, nbSH, nbTotal;
    IloNum priceGS, priceGB;
    IloNum priceCC = 0.4, priceWH = 0.001, coTAR = 0.7, coDEV = 0.3;

    IloCsvReader csvReader(env, fileConfig);
    IloCsvReader::LineIterator lineIte(csvReader);
    IloCsvLine line = *lineIte;
    ++lineIte;
    time.push_back(line.getFloatByPosition(0));
    time.push_back(line.getFloatByPosition(1));
    time.push_back(line.getFloatByPosition(2));
    ++lineIte; ++lineIte;
    nbCS = line.getFloatByPosition(0);
    nbSH = line.getFloatByPosition(1);
    nbTotal = nbCS + nbSH;
    ++lineIte; ++lineIte;
    priceGS = line.getFloatByPosition(0);
    priceGB = line.getFloatByPosition(1);
    listEV = vector<int>(nbCS, 0);

    IloNumArray solar(env, time[0]);
    IloNum2D evEmax  = Ilo2dNumConstruct(env, nbCS, listEV);
    IloNum2D evEmin  = Ilo2dNumConstruct(env, nbCS, listEV);
    IloNum2D evDmax  = Ilo2dNumConstruct(env, nbCS, listEV);
    IloNum2D evCmax  = Ilo2dNumConstruct(env, nbCS, listEV);
    IloNum2D evDeff  = Ilo2dNumConstruct(env, nbCS, listEV);
    IloNum2D evCeff  = Ilo2dNumConstruct(env, nbCS, listEV);
    IloNum2D evEobj  = Ilo2dNumConstruct(env, nbCS, listEV);
    IloNum2D evEarr  = Ilo2dNumConstruct(env, nbCS, listEV);
    IloNum2D evTarr  = Ilo2dNumConstruct(env, nbCS, listEV);
    IloNum2D evTdep  = Ilo2dNumConstruct(env, nbCS, listEV);
    IloNum2D evTmin  = Ilo2dNumConstruct(env, nbCS, listEV);
    IloNum2D evK     = Ilo2dNumConstruct(env, nbCS, listEV);
    IloNum2D evTAR   = Ilo2dNumConstruct(env, nbCS, listEV);
    IloNum2D loadPro = Ilo2dNumConstruct(env, nbSH, time[0]);


    csvReader = IloCsvReader(env, fileLocEV);
    lineIte = IloCsvReader::LineIterator(csvReader);
    line = *lineIte;
    ++lineIte;
    for(lineIte; lineIte.ok(); ++lineIte){
        IloInt numCS    = line.getFloatByPosition(1) - 1;
        listEV[numCS]++;
        evTarr[numCS].add(line.getFloatByPosition(2));
        evTdep[numCS].add(line.getFloatByPosition(3));
        evEmax[numCS].add(line.getFloatByPosition(4));
        evEarr[numCS].add(line.getFloatByPosition(5) * line.getFloatByPosition(4));
        evDmax[numCS].add(line.getFloatByPosition(6) * line.getFloatByPosition(4));
        evCmax[numCS].add(line.getFloatByPosition(7) * line.getFloatByPosition(4));
        evDeff[numCS].add(line.getFloatByPosition(8));
        evCeff[numCS].add(line.getFloatByPosition(9));
        evEobj[numCS].add(line.getFloatByPosition(10) * line.getFloatByPosition(4));
        evEmin[numCS].add(line.getFloatByPosition(11));
        evK   [numCS].add(line.getFloatByPosition(12));
        evTAR [numCS].add(line.getFloatByPosition(13));
    }
    csvReader = IloCsvReader(env, fileLocSolar);
    lineIte = IloCsvReader::LineIterator(csvReader);
    line = *lineIte;
    ++lineIte;
    for (int i = 0; i < time[0]; i++) {
        solar[i] = line.getFloatByPosition(0);
        ++lineIte;
    }

    csvReader = IloCsvReader(env, fileLocPro);
    lineIte = IloCsvReader::LineIterator(csvReader);
    line = *lineIte;
    ++lineIte;
    for (int i = 0; i < time[0]; i++) {
        for (int j = 0; j < nbSH; j++) {
            loadPro[j][i] = line.getFloatByPosition(j);
        }
        ++lineIte;
    }

    ofstream out;
    IloNum3D evBase = Ilo3dNumConstrcut(env, nbCS, listEV, time[0]);
    for (int i = 0; i < nbCS; i++) {
        out.open(fileName("baseLine", "baseLine", "_CS", i), ios::out, ios::trunc);
        for (int n = 0; n < listEV[i]; n++) {
            int ts = 0;
            for (int t = 0; t < time[0]; t++) {
                if (t <= evTarr[i][n])
                    evBase[i][n][t] = evEarr[i][n];
                else {
                    evBase[i][n][t] = evBase[i][n][t - 1] + evCeff[i][n] * evCmax[i][n];
                    if (evBase[i][n][t] >= evEmax[i][n]) {
                        ts = t;
                        break;
                    }
                    else
                        continue;
                }
            }
            for (int k = ts; k < time[0]; k++)
                evBase[i][n][k] = evEmax[i][n];
            for (int t = 0; t < time[0]; t++)
                out << evBase[i][n][t] << ",";
            out << "\n";
        }
        out.close();
    }

    IloNumArray solU_Cs   = IloNumArray(env, nbCS);
    IloNumArray solU_Pr   = IloNumArray(env, nbSH);
    IloNum2D solPgsCS     = Ilo2dNumConstruct(env, nbCS, time[0]);
    IloNum2D solPgbCS     = Ilo2dNumConstruct(env, nbCS, time[0]);
    IloNum2D solPgsPro    = Ilo2dNumConstruct(env, nbSH, time[0]);
    IloNum2D solPgbPro    = Ilo2dNumConstruct(env, nbSH, time[0]);
    IloNum2D solLambda    = Ilo2dNumConstruct(env, nbCS, listEV);
    IloNum2D solTAR       = Ilo2dNumConstruct(env, nbCS, listEV);
    IloNum2D solDEV       = Ilo2dNumConstruct(env, nbCS, listEV);
    IloNum2D solMIL       = Ilo2dNumConstruct(env, nbCS, listEV);
    IloNum3D solElevel    = Ilo3dNumConstrcut(env, nbCS, listEV, time[0]);
    IloNum3D solQCharge   = Ilo3dNumConstrcut(env, nbCS, listEV, time[0]);
    IloNum3D solQDharge   = Ilo3dNumConstrcut(env, nbCS, listEV, time[0]);
    IloNum3D solPExchange = Ilo3dNumConstrcut(env, nbTotal, nbTotal, time[0]);

    do {
        IloNumVarArray u_Cs = IloNumVarArray(env, nbCS, -IloInfinity, IloInfinity);
        IloNumVarArray u_Pr = IloNumVarArray(env, nbSH, -IloInfinity, IloInfinity);
        IloNumVar2D pgsCS   = Ilo2dNumVarConstruct(env, nbCS, time[0], 1);
        IloNumVar2D pgbCS   = Ilo2dNumVarConstruct(env, nbCS, time[0], 1);
        IloNumVar2D pgsPro  = Ilo2dNumVarConstruct(env, nbSH, time[0], 1);
        IloNumVar2D pgbPro  = Ilo2dNumVarConstruct(env, nbSH, time[0], 1);
        IloNumVar2D lambda  = Ilo2dNumVarConstruct(env, nbCS, listEV, 1);
        IloNumExpr2D TAR    = Ilo2dNumExprConstruct(env, nbCS, listEV);
        IloNumExpr2D DEV    = Ilo2dNumExprConstruct(env, nbCS, listEV);
        IloNumExpr2D MIL    = Ilo2dNumExprConstruct(env, nbCS, listEV);
        IloNumVar3D elevel  = Ilo3dNumVarConstrcut(env, nbCS, listEV, time[0], 1);
        IloNumVar3D qCharge = Ilo3dNumVarConstrcut(env, nbCS, listEV, time[0], 1);
        IloNumVar3D qDharge = Ilo3dNumVarConstrcut(env, nbCS, listEV, time[0], 1);
        //the index below three is [nbCS, nbSH]
        IloNumVar3D pExchange = Ilo3dNumVarConstrcut(env, nbTotal, nbTotal, time[0], 0);
        IloNumVarArray ps = IloNumVarArray(env, nbTotal * nbTotal * time[0], -IloInfinity, IloInfinity);
        IloNumVar3D t1    = Ilo3dNumVarConstrcut(env, nbTotal, nbTotal, time[0], 1);
        IloNumVar3D t2    = Ilo3dNumVarConstrcut(env, nbTotal, nbTotal, time[0], 1);


        IloModel mod(env);
        IloExpr obj(env);

        //objective
        obj = u_Cs[0] - u_Cs[0];
        obj += IloSum(u_Cs) + IloSum(u_Pr);

        //linearization setUp
        for (int i = 0; i < nbTotal; i++)
            for (int m = 0; m < nbTotal; m++)
                for (int t = 0; t < time[0]; t++)
                    mod.add(t1[i][m][t] - t2[i][m][t] == pExchange[i][m][t]);

        //CS objective
        for (int i = 0; i < nbCS; i++) {
            IloExpr temp(env);
            temp += priceGS * IloSum(pgsCS[i]) - priceGB * IloSum(pgbCS[i]);
            for (int t = 0; t < time[0]; t++)
                for (int n = 0; n < nbTotal; n++)
                    temp -= priceWH * (t1[i][n][t] + t2[i][n][t]);
            for (int n = 0; n < listEV[i]; n++) {
                temp -= lambda[i][n] * lambda[i][n] * evK[i][n];
                temp += priceCC * (elevel[i][n][evTdep[i][n]] - evEarr[i][n]);
            }
            mod.add(temp == u_Cs[i]);
        }

        //SH objective
        for (int i = 0; i < nbSH; i++) {
            IloExpr temp(env);
            temp += priceGS * IloSum(pgsPro[i]) - priceGB * IloSum(pgbPro[i]);
            temp -= priceWH * (Ilo2Sum(t1[i + nbCS]) + Ilo2Sum(t2[i + nbCS]));
            for (int t = 0; t < time[0]; t++)
                for (int n = 0; n < nbTotal; n++)
                    temp -= priceWH * (t1[i + nbCS][n][t] + t2[i + nbCS][n][t]);
            mod.add(temp == u_Pr[i]);
        }

        //CS constraints
        for (int i = 0; i < nbCS; i++) {
            //flexibility index
            for (int n = 0; n < listEV[i]; n++) {
                for (int t = 0; t < time[0]; t++) {
                    if (t > evTarr[i][n] and t <= evTdep[i][n]) {
                        DEV[i][n] += evBase[i][n][t] - elevel[i][n][t];
                    }
                }
                TAR[i][n] = evEmax[i][n] - elevel[i][n][evTdep[i][n]];
                mod.add(coDEV * DEV[i][n] + coTAR * TAR[i][n] == evK[i][n] * lambda[i][n]);
            }

            //battery constraints
            for (int n = 0; n < listEV[i]; n++) {
                for (int t = 0; t < time[0]; t++) {
                    if (t > evTarr[i][n] && t <= evTdep[i][n]) {
                        mod.add(qCharge[i][n][t] >= 0);
                        mod.add(qDharge[i][n][t] >= 0);
                        mod.add(qCharge[i][n][t] <= evCmax[i][n]);
                        mod.add(qDharge[i][n][t] <= evDmax[i][n]);

                        mod.add(elevel[i][n][t] == elevel[i][n][t - 1] + evCeff[i][n] * qCharge[i][n][t] - qDharge[i][n][t] / evDeff[i][n]);
                        mod.add(elevel[i][n][t] <= evEmax[i][n]);
                        mod.add(elevel[i][n][t] >= evEmin[i][n]);
                    }
                    else {
                        mod.add(qCharge[i][n][t] == 0);
                        mod.add(qDharge[i][n][t] == 0);

                        mod.add(elevel[i][n][t] <= evEmax[i][n]);
                        mod.add(elevel[i][n][t] >= evEmin[i][n]);
                    }
                    if (t == evTarr[i][n])
                        mod.add(elevel[i][n][t] == evEarr[i][n]);
                    if (t == evTdep[i][n]) {
                        mod.add(elevel[i][n][t] <= evEobj[i][n]);
                        mod.add(elevel[i][n][t] >= evEobj[i][n] - evTAR[i][n]);
                    }
                }
            }

            //power balance
            for (int t = 0; t < time[0]; t++) {
                IloExpr lhs(env), rhs(env);
                for (int n = 0; n < listEV[i]; n++) {
                    lhs += qCharge[i][n][t];
                    rhs += qDharge[i][n][t];
                }
                lhs += pgsCS[i][t];
                rhs += pgbCS[i][t] + solar[t];
                for (int m = 0; m < nbTotal; m++)
                    lhs += pExchange[i][m][t];

                mod.add(lhs == rhs);
            }
        }

        //SH constraints
        for (int t = 0; t < time[0]; t++) {
            for (int i = 0; i < nbSH; i++) {
                IloExpr lhs(env), rhs(env);
                lhs += pgsPro[i][t] + loadPro[i][t];
                rhs += pgbPro[i][t] + solar[t];
                for (int m = 0; m < nbTotal; m++)
                    lhs += pExchange[i + nbCS][m][t];
                mod.add(lhs == rhs);
            }
        }

        //P2P constraints
        for (int t = 0; t < time[0]; t++) {
            for (int i = 0; i < nbTotal; i++) {
                for (int m = 0; m < nbTotal; m++) {
                    if (t < time[1] or t > time[2])
                        mod.add(pExchange[i][m][t] == 0);
                    else
                        mod.add(pExchange[i][m][t] == -pExchange[m][i][t]);
                }
            }
        }
        IloCplex cplex(mod);
        mod.add(IloMaximize(env, obj));
        cplex.solve();
        std::cout << "status : " << cplex.getStatus() << endl;
        std::cout << "Objective value : " << cplex.getObjValue() << endl;

        //get solution
        cplex.getValues(u_Cs, solU_Cs);
        cplex.getValues(u_Pr, solU_Pr);
        IloGetValues(cplex, &solPgsCS, pgsCS);
        IloGetValues(cplex, &solPgbCS, pgbCS);
        IloGetValues(cplex, &solPgsPro, pgsPro);
        IloGetValues(cplex, &solPgbPro, pgbPro);
        // IloGetValues(cplex, &solLambda, lambda);
        IloGetValues(cplex, &solTAR, TAR);
        IloGetValues(cplex, &solDEV, DEV);
        IloGetValues(cplex, &solElevel, elevel);
        IloGetValues(cplex, &solQCharge, qCharge);
        IloGetValues(cplex, &solQDharge, qDharge);
        IloGetValues(cplex, &solPExchange, pExchange);

        //output result
        out.open(fileName("nash profit maximization", "listEV"), ios::out, ios::trunc);
        out << std::setprecision(10);
        for (int i = 0; i < nbCS; i++)
            out << listEV[i] << endl;
        out.close();
        //out.open(fileName("nash profit maximization", "power exchange"), ios::out, ios::trunc);
        //out << std::setprecision(10);
        //for (int t = 0; t < time[0]; t++) {
        //    //out << "time :" << t + 1 << endl;
        //    for (int i = 0; i < nbTotal; i++) {
        //        for (int m = 0; m < nbTotal; m++) {
        //            out << solPExchange[i][m][t] << ",";
        //        }
        //        out << "\n";
        //    }
        //    //out << "\n";
        //}
        //out.close();
        //for (int i = 0; i < nbCS; i++) {
        //    out.open(fileName("nash profit maximization", "eLevel", i), ios::out, ios::trunc);
        //    out << std::setprecision(10);
        //    for (int t = 0; t < time[0]; t++) {
        //        for (int n = 0; n < listEV[i]; n++) {
        //            if (t >= evTarr[i][n] and t <= evTdep[i][n])
        //                out << solElevel[i][n][t] << ",";
        //            else
        //                out << "#N/A" << ",";
        //        }
        //        out << "\n";
        //    }
        //    out.close();
        //}
        for (int i = 0; i < nbCS; i++) {
            out.open(fileName("nash profit maximization", "qCharge", i), ios::out, ios::trunc);
            out << std::setprecision(10);
            for (int t = 0; t < time[0]; t++) {
                for (int n = 0; n < listEV[i]; n++) {
                    out << solQCharge[i][n][t] << ",";
                }
                out << "\n";
            }
            out.close();
        }
        for (int i = 0; i < nbCS; i++) {
            out.open(fileName("nash profit maximization", "qDisCharge", i), ios::out, ios::trunc);
            out << std::setprecision(10);
            for (int t = 0; t < time[0]; t++) {
                for (int n = 0; n < listEV[i]; n++) {
                    out << solQDharge[i][n][t] << ",";
                }
                out << "\n";
            }
            out.close();
        }
        //for (int i = 0; i < nbCS; i++) {
        //    out.open(fileName("nash profit maximization", "grid power", "CS", i), ios::out, ios::trunc);
        //    out << std::setprecision(10);
        //    for (int t = 0; t < time[0]; t++)
        //        out << solPgbCS[i][t] << "," << solPgsCS[i][t] << "\n";
        //    out.close();
        //}
        //for (int i = 0; i < nbSH; i++) {
        //    out.open(fileName("nash profit maximization", "grid power", "SH", i), ios::out, ios::trunc);
        //    out << std::setprecision(10);
        //    for (int t = 0; t < time[0]; t++)
        //        out << solPgbPro[i][t] << "," << solPgsPro[i][t] << "\n";
        //    out.close();
        //}
    } while (0);
}