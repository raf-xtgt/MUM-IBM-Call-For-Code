#include "Header.h"
int main() {

    IloEnv env;
    std::filesystem::create_directories("broadcasted result");
    std::filesystem::create_directories("lagrange multiplier");
    std::filesystem::path cFile = std::filesystem::current_path();
    string cwd = cFile.string();
    std::replace(cwd.begin(), cwd.end(), '\\', '/');
    char* fileListEV = fileName(cwd + "/nash profit maximization", "listEV");
    char* fileBidRange = fileName(cwd + "/bidding range", "bid range");
    char* fileConfig = fileName(cwd, "Market Parameter");
    char* fileLocPro = fileName(cwd, "Power Consumption - BFM");
    char* fileLocSolar = fileName(cwd, "Solar");

    std::vector<int> time, listEV;
    IloInt nbCS, nbSH, nbTotal;
    IloNum priceGS, priceGB;

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
    csvReader = IloCsvReader(env, fileListEV);
    lineIte = IloCsvReader::LineIterator(csvReader);
    line = *lineIte;
    for (int i = 0; i < nbCS; i++) {
        listEV[i] = line.getFloatByPosition(0);
        ++lineIte;
    }

    IloNumArray solar(env, time[0]);
    csvReader = IloCsvReader(env, fileLocSolar);
    lineIte = IloCsvReader::LineIterator(csvReader);
    line = *lineIte;
    ++lineIte;
    for (int i = 0; i < time[0]; i++) {
        solar[i] = line.getFloatByPosition(0);
        ++lineIte;
    }

    IloNum2D loadPro = Ilo2dNumConstruct(env, nbSH, time[0]);
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
    IloNum3D evQCharge = Ilo3dNumConstrcut(env, nbCS, listEV, time[0]);
    IloNum3D evQDharge = Ilo3dNumConstrcut(env, nbCS, listEV, time[0]);
    ofstream out;
    for (int i = 0; i < nbCS; i++) {
        csvReader = IloCsvReader(env, fileName("nash profit maximization", "qCharge", i));
        lineIte = IloCsvReader::LineIterator(csvReader);
        line = *lineIte;
        for (int t = 0; t < time[0]; t++) {
            for (int n = 0; n < listEV[i]; n++)
                evQCharge[i][n][t] = line.getFloatByPosition(n);
            ++lineIte;
        }
    }
    for (int i = 0; i < nbCS; i++) {
        csvReader = IloCsvReader(env, fileName("nash profit maximization", "qDisCharge", i));
        lineIte = IloCsvReader::LineIterator(csvReader);
        line = *lineIte;
        for (int t = 0; t < time[0]; t++) {
            for (int n = 0; n < listEV[i]; n++)
                evQDharge[i][n][t] = line.getFloatByPosition(n);
            ++lineIte;
        }
    }

    IloNum2D actualBuyPrice = Ilo2dNumConstruct(env, nbTotal, time[0]);
    IloNum2D actualSellPrice = Ilo2dNumConstruct(env, nbTotal, time[0]);
    for (int t = 0; t < time[0]; t++) {
        csvReader = IloCsvReader(env, fileName("customer bidding", "bid buy price"));
        lineIte = IloCsvReader::LineIterator(csvReader);
        line = *lineIte;
        for (int i = 0; i < nbTotal; i++) {
            actualBuyPrice[i][t] = line.getFloatByPosition(i);
            ++lineIte;
        }
    }
    for (int t = 0; t < time[0]; t++) {
        csvReader = IloCsvReader(env, fileName("customer bidding", "bid sell price"));
        lineIte = IloCsvReader::LineIterator(csvReader);
        line = *lineIte;
        for (int i = 0; i < nbTotal; i++) {
            actualSellPrice[i][t] = line.getFloatByPosition(i);
            ++lineIte;
        }
    }

    IloNumArray optimalBuyPrice(env, time[0]);
    IloNumArray optimalSellPrice(env, time[0]);
    IloNumArray maxBuyPrice(env);
    IloNumArray minBuyPrice(env);
    IloNumArray finalBuyPrice(env, time[0]);
    IloNumArray finalSellPrice(env, time[0]);
    IloNumArray maxSellPrice(env);
    IloNumArray minSellPrice(env);

    IloNum2D netLoad = Ilo2dNumConstruct(env, nbTotal, time[0]);
    IloNum2D prioBuy = Ilo2dNumConstruct(env, nbTotal, time[0]);
    IloNum2D prioSell = Ilo2dNumConstruct(env, nbTotal, time[0]);

    IloNum2D solGridBuy = Ilo2dNumConstruct(env, nbTotal, time[0]);
    IloNum2D solGridSell = Ilo2dNumConstruct(env, nbTotal, time[0]);
    IloNum2D solP2pBuy = Ilo2dNumConstruct(env, nbTotal, time[0]);
    IloNum2D solP2pSell = Ilo2dNumConstruct(env, nbTotal, time[0]);
    IloNumArray costAcution = IloNumArray(env, nbTotal);

    //reduced cost
    IloNum2D rCostGridBuy = Ilo2dNumConstruct(env, nbTotal, time[0]);
    IloNum2D rCostGridSell = Ilo2dNumConstruct(env, nbTotal, time[0]);
    IloNum2D rCostP2pBuy = Ilo2dNumConstruct(env, nbTotal, time[0]);
    IloNum2D rCostP2pSell = Ilo2dNumConstruct(env, nbTotal, time[0]);

    //slack
    IloNumArray slackNetTrade(env);
    IloNumArray slackPowerBalance(env);
    IloNumArray slackBuyTimeLimit(env);
    IloNumArray slackSellTimeLimit(env);

    //lagrange multiplier
    IloNumArray lagNetTrade(env);
    IloNumArray lagPowerBalance(env);
    IloNumArray lagBuyTimeLimit(env);
    IloNumArray lagSellTimeLimit(env);

    std::chrono::steady_clock::time_point begin = std::chrono::steady_clock::now();
    IloExpr obj(env);
    IloModel mod(env);
    IloCplex cplex(mod);

    //set of variables
    //Flat[x + WIDTH * (y + DEPTH * z)] = Original[x, y, z]
    static std::vector<int> indice = generateIndice(4, nbTotal, time[0]);
    IloNumVar2D gridBuy = Ilo2dNumVarConstruct(env, nbTotal, time[0], 1, "gridBuy");
    IloNumVar2D gridSell = Ilo2dNumVarConstruct(env, nbTotal, time[0], 1, "gridSell");
    IloNumVar2D p2pBuy = Ilo2dNumVarConstruct(env, nbTotal, time[0], 1, "p2pBuy");
    IloNumVar2D p2pSell = Ilo2dNumVarConstruct(env, nbTotal, time[0], 1, "p2pSell");
    for (int i = 0; i < nbTotal; i++) {
        for (int t = 0; t < time[0]; t++) {
            gridBuy[i][t].setObject(&indice[0 * nbTotal * time[0] + time[0] * i + t]);
            gridSell[i][t].setObject(&indice[1 * nbTotal * time[0] + time[0] * i + t]);
            p2pBuy[i][t].setObject(&indice[2 * nbTotal * time[0] + time[0] * i + t]);
            p2pSell[i][t].setObject(&indice[3 * nbTotal * time[0] + time[0] * i + t]);
        }
    }
    //set of constraints type
    IloRangeArray netTrade(env);
    IloRangeArray powerBalance(env);
    IloRangeArray buyTimeLimit(env);
    IloRangeArray sellTimeLimit(env);

    std::srand((unsigned)std::time(0));
    ////CS net load
    for (int i = 0; i < nbCS; i++) {
        for (int t = 0; t < time[0]; t++) {
            IloNum temp = 0;
            for (int n = 0; n < listEV[i]; n++)
                temp += evQCharge[i][n][t] - evQDharge[i][n][t];
            netLoad[i][t] = temp - solar[t];
        }
    }
    //Prosumer net load
    for (int i = 0; i < nbSH; i++)
        for (int t = 0; t < time[0]; t++)
            netLoad[i + nbCS][t] = loadPro[i][t] - solar[t];

    csvReader = IloCsvReader(env, fileBidRange);
    lineIte = IloCsvReader::LineIterator(csvReader);
    line = *lineIte;
    for (lineIte; lineIte.ok(); ++lineIte) {
        minBuyPrice.add(line.getFloatByPosition(0));
        maxBuyPrice.add(line.getFloatByPosition(1));
        minSellPrice.add(line.getFloatByPosition(2));
        maxSellPrice.add(line.getFloatByPosition(3));
    }
    for (int i = 0; i < minBuyPrice.getSize(); i++)
        cout << minBuyPrice[i] << endl;


        for (int t = 0; t < time[0]; t++) {
           for (int i = 0; i < nbTotal; i++) {
                prioBuy[i][t] = 1 - actualBuyPrice[i][t] / maxBuyPrice[t];
                prioSell[i][t] = actualSellPrice[i][t] / maxSellPrice[t];
            }
       }

    for (int t = 0; t < time[0]; t++) {
        IloNum meanBuy = 0, meanSell = 0;
        for (int i = 0; i < nbTotal; i++) {
            meanBuy += actualBuyPrice[i][t];
            meanSell += actualSellPrice[i][t];
        }
        finalBuyPrice[t] = meanBuy / (nbTotal);
        finalSellPrice[t] = meanSell / (nbTotal);
    }

    //set up objective
    obj = gridBuy[0][0] - gridBuy[0][0];
    for (int t = 0; t < time[0]; t++) {
        for (int i = 0; i < nbTotal; i++) {
            obj += p2pBuy[i][t] * prioBuy[i][t] + p2pSell[i][t] * prioSell[i][t] + gridBuy[i][t] + gridSell[i][t];
        }
    }
    // net trade = 0
    for (int t = 0; t < time[0]; t++) {
        IloExpr buy(env), sell(env);
        for (int i = 0; i < nbTotal; i++) {
            buy += p2pBuy[i][t];
            sell += p2pSell[i][t];
        }
        //mod.add(buy == sell);
        netTrade.add(IloRange(env, 0, buy - sell, 0, name("netTrade", t)));
    }

    // power balance
    for (int t = 0; t < time[0]; t++) {
        for (int i = 0; i < nbTotal; i++) {
            //mod.add(netLoad[i][t] == p2pBuy[i][t] + gridBuy[i][t] - p2pSell[i][t] - gridSell[i][t]);
            powerBalance.add(IloRange(env, netLoad[i][t], p2pBuy[i][t] + gridBuy[i][t] - p2pSell[i][t] - gridSell[i][t], netLoad[i][t], name("powerBalance", i, t)));
        }
    }

    //trading time limit
    for (int t = 0; t < time[0]; t++) {
        for (int i = 0; i < nbTotal; i++) {
            if (t < time[1] or t > time[2]) {
                //mod.add(p2pBuy[i][t] == 0);
                buyTimeLimit.add(IloRange(env, 0, p2pBuy[i][t], 0, name("BuyTimeLimit", i, t)));
                //mod.add(p2pSell[i][t] == 0);
                sellTimeLimit.add(IloRange(env, 0, p2pSell[i][t], 0, name("SellTimeLimit", i, t)));

            }
        }
    }

    mod.add(netTrade);
    mod.add(powerBalance);
    mod.add(sellTimeLimit);
    mod.add(buyTimeLimit);
    mod.add(IloMinimize(env, obj));
    cplex.solve();
    std::chrono::steady_clock::time_point end = std::chrono::steady_clock::now();
    std::cout << "Time difference = " << std::chrono::duration_cast<std::chrono::microseconds>(end - begin).count() << "[us]" << std::endl;
    std::cout << "status : " << cplex.getStatus() << endl;
    std::cout << "Objective value : " << cplex.getObjValue() << endl;

    IloGetValues(cplex, &solGridBuy, gridBuy);
    IloGetValues(cplex, &solGridSell, gridSell);
    IloGetValues(cplex, &solP2pBuy, p2pBuy);
    IloGetValues(cplex, &solP2pSell, p2pSell);

    /************************************
     *           Primal Result          *
     ************************************/
    out.open(fileName("broadcasted result", "p2pSell"), ios::out, ios::trunc);
    out << std::setprecision(10);
    for (int t = 0; t < time[0]; t++) {
        for (int i = 0; i < nbTotal; i++)
            out << solP2pSell[i][t] << ",";
        out << "\n";
    }
    out.close();
    out.open(fileName("broadcasted result", "p2pBuy"), ios::out, ios::trunc);
    out << std::setprecision(10);
    for (int t = 0; t < time[0]; t++) {
        for (int i = 0; i < nbTotal; i++)
            out << solP2pBuy[i][t] << ",";
        out << "\n";
    }
    out.close();
    out.open(fileName("broadcasted result", "grid buy"), ios::out, ios::trunc);
    out << std::setprecision(10);
    for (int t = 0; t < time[0]; t++) {
        for (int i = 0; i < nbTotal; i++)
            out << solGridBuy[i][t] << ",";
        out << "\n";
    }
    out.close();
    out.open(fileName("broadcasted result", "grid sell"), ios::out, ios::trunc);
    out << std::setprecision(10);
    for (int t = 0; t < time[0]; t++) {
        for (int i = 0; i < nbTotal; i++)
            out << solGridSell[i][t] << ",";
        out << "\n";
    }
    out.close();
    out.open(fileName("broadcasted result", "priority sell"), ios::out, ios::trunc);
    out << std::setprecision(10);
    for (int t = 0; t < time[0]; t++) {
        for (int i = 0; i < nbTotal; i++)
            out << prioSell[i][t] << ",";
        out << "\n";
    }
    out.close();
    out.open(fileName("broadcasted result", "priority buy"), ios::out, ios::trunc);
    out << std::setprecision(10);
    for (int t = 0; t < time[0]; t++) {
        for (int i = 0; i < nbTotal; i++)
            out << prioBuy[i][t] << ",";
        out << "\n";
    }
    out.close();
    out.open(fileName("broadcasted result", "netLoad"), ios::out, ios::trunc);
    out << std::setprecision(10);
    for (int t = 0; t < time[0]; t++) {
        for (int i = 0; i < nbTotal; i++)
            out << netLoad[i][t] << ",";
        out << "\n";
    }
    out.close();
    /************************************
     *             Dual Result          *
     ************************************/

     //get constraints slacks
    cplex.getSlacks(slackPowerBalance, powerBalance);
    cplex.getSlacks(slackNetTrade, netTrade);
    cplex.getSlacks(slackSellTimeLimit, sellTimeLimit);
    cplex.getSlacks(slackBuyTimeLimit, buyTimeLimit);
    out.open(fileName("lagrange multiplier", "slack_powerBalance"), ios::out, ios::trunc);
    out << std::setprecision(10);
    for (int i = 0; i < slackPowerBalance.getSize(); i++)
        out << slackPowerBalance[i] << "\n";
    out.close();
    out.open(fileName("lagrange multiplier", "slack_netTrade"), ios::out, ios::trunc);
    out << std::setprecision(10);
    for (int i = 0; i < slackNetTrade.getSize(); i++)
        out << slackNetTrade[i] << "\n";
    out.close();
    out.open(fileName("lagrange multiplier", "slack_sellTimeLimit"), ios::out, ios::trunc);
    out << std::setprecision(10);
    for (int i = 0; i < slackSellTimeLimit.getSize(); i++)
        out << slackSellTimeLimit[i] << "\n";
    out.close();
    out.open(fileName("lagrange multiplier", "slack_buyTimeLimit"), ios::out, ios::trunc);
    out << std::setprecision(10);
    for (int i = 0; i < slackBuyTimeLimit.getSize(); i++)
        out << slackBuyTimeLimit[i] << "\n";
    out.close();

    //get lagrange multiplier
    cplex.getDuals(lagPowerBalance, powerBalance);
    cplex.getDuals(lagNetTrade, netTrade);
    cplex.getDuals(lagSellTimeLimit, sellTimeLimit);
    cplex.getDuals(lagBuyTimeLimit, buyTimeLimit);
    out.open(fileName("lagrange multiplier", "dual_powerBalance"), ios::out, ios::trunc);
    out << std::setprecision(10);
    for (int i = 0; i < lagPowerBalance.getSize(); i++)
        out << lagPowerBalance[i] << "\n";
    out.close();
    out.open(fileName("lagrange multiplier", "dual_netTrade"), ios::out, ios::trunc);
    out << std::setprecision(10);
    for (int i = 0; i < lagNetTrade.getSize(); i++)
        out << lagNetTrade[i] << "\n";
    out.close();
    out.open(fileName("lagrange multiplier", "dual_sellTimeLimit"), ios::out, ios::trunc);
    out << std::setprecision(10);
    for (int i = 0; i < lagSellTimeLimit.getSize(); i++)
        out << lagSellTimeLimit[i] << "\n";
    out.close();
    out.open(fileName("lagrange multiplier", "dual_buyTimeLimit"), ios::out, ios::trunc);
    out << std::setprecision(10);
    for (int i = 0; i < lagBuyTimeLimit.getSize(); i++)
        out << lagBuyTimeLimit[i] << "\n";
    out.close();

    //get reduced cost
    IloGetReduced(cplex, &rCostGridBuy, gridBuy);
    IloGetReduced(cplex, &rCostGridSell, gridSell);
    IloGetReduced(cplex, &rCostP2pBuy, p2pBuy);
    IloGetReduced(cplex, &rCostP2pSell, p2pSell);
    out.open(fileName("lagrange multiplier", "rCost_gridBuy"), ios::out, ios::trunc);
    out << std::setprecision(10);
    for (int t = 0; t < time[0]; t++) {
        for (int i = 0; i < nbTotal; i++)
            out << rCostGridBuy[i][t] << ",";
        out << "\n";
    }
    out.close();
    out.open(fileName("lagrange multiplier", "rCost_gridSell"), ios::out, ios::trunc);
    out << std::setprecision(10);
    for (int t = 0; t < time[0]; t++) {
        for (int i = 0; i < nbTotal; i++)
            out << rCostGridSell[i][t] << ",";
        out << "\n";
    }
    out.close();
    out.open(fileName("lagrange multiplier", "rCost_p2pSell"), ios::out, ios::trunc);
    out << std::setprecision(10);
    for (int t = 0; t < time[0]; t++) {
        for (int i = 0; i < nbTotal; i++)
            out << rCostP2pSell[i][t] << ",";
        out << "\n";
    }
    out.close();
    out.open(fileName("lagrange multiplier", "rCost_p2pBuy"), ios::out, ios::trunc);
    out << std::setprecision(10);
    for (int t = 0; t < time[0]; t++) {
        for (int i = 0; i < nbTotal; i++)
            out << rCostP2pBuy[i][t] << ",";
        out << "\n";
    }
    out.close();
    system("pause");
}