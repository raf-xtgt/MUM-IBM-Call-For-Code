#include "Header.h"
#include <ilconcert/ilosys.h>
int main(){
    
    IloEnv env;
    printf("Hello");
	std::filesystem::create_directories("bidding range");

    std::filesystem::path cFile = std::filesystem::current_path();
    
    string cwd = cFile.string();
    std::replace(cwd.begin(), cwd.end(), '\\', '/');

    char* fileConfig = fileName(cwd, "Market Parameter");
    printf(fileConfig);
    
    char* fileLocPro = fileName(cwd, "Power Consumption - BFM");
    printf(fileLocPro);

    char* fileLocSolar = fileName(cwd, "Solar");
    printf(fileLocSolar);
    
    char* fileListEV = fileName(cwd + "/nash profit maximization", "listEV");
    printf(fileListEV);
    
    
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
    cout << "End here 3" << endl;
    listEV = vector<int>(nbCS, 0);
    csvReader = IloCsvReader(env, fileListEV);
    lineIte = IloCsvReader::LineIterator(csvReader);
    line = *lineIte;
    for (int i = 0; i < nbCS; i++) {
        listEV[i] = line.getFloatByPosition(0);
        ++lineIte;
    }



    IloNum3D evQCharge = Ilo3dNumConstrcut(env, nbCS, listEV, time[0]);
    IloNum3D evQDharge = Ilo3dNumConstrcut(env, nbCS, listEV, time[0]);
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

    IloNumArray totalExcess(env, time[0]);
    IloNumArray totalDeficiciency(env, time[0]);
    IloNumArray optimalBuyPrice(env, time[0]);
    IloNumArray optimalSellPrice(env, time[0]);
    IloNumArray maxBuyPrice(env, time[0]);
    IloNumArray minBuyPrice(env, time[0]);
    IloNumArray maxSellPrice(env, time[0]);
    IloNumArray minSellPrice(env, time[0]);
    IloNum2D netLoad = Ilo2dNumConstruct(env, nbTotal, time[0]);

    //CS net load
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
    // Check for excess, deficiency and total demand for every hour.
    for (int i = 0; i < nbTotal; i++) {
        for (int t = 0; t < time[0]; t++) {
            if (netLoad[i][t] < 0)
                totalExcess[t] -= netLoad[i][t];
            else
                totalDeficiciency[t] += netLoad[i][t];
        }
    }

    for (int t = 0; t < time[0]; t++) {
        //scenario 1
        if (totalExcess[t] == totalDeficiciency[t]) {
            optimalBuyPrice[t] = (priceGB + priceGS) / 2;
            optimalSellPrice[t] = optimalBuyPrice[t];
        }
        //scenario2
        else if (totalExcess[t] > totalDeficiciency[t]) {
            optimalBuyPrice[t] = (priceGB + priceGS) / 2;
            optimalSellPrice[t] = ((optimalBuyPrice[t] * totalDeficiciency[t]) + (priceGS * (totalExcess[t] - totalDeficiciency[t]))) / totalExcess[t];
        }
        //scenario3
        else {
            optimalSellPrice[t] = (priceGB + priceGS) / 2;
            optimalBuyPrice[t] = ((optimalSellPrice[t] * totalExcess[t]) + (priceGB * (totalDeficiciency[t] - totalExcess[t]))) / totalDeficiciency[t];
        }
        maxBuyPrice[t]  = (1.2 * optimalBuyPrice[t] > priceGB) ? priceGB : 1.2 * optimalBuyPrice[t];
        minBuyPrice[t]  =  0.8 * optimalBuyPrice[t];
        maxSellPrice[t] =  1.2 * optimalSellPrice[t];
        minSellPrice[t] = (0.8 * optimalSellPrice[t] < priceGS) ? priceGS : 0.8 * optimalSellPrice[t];
    }
    cout << "End here 1" << endl;
    ofstream out;
    //char* fileLocBidRange = fileName(cwd, "bid range");
    //printf(fileLocBidRange);
    out.open(fileName("bidding range","bid range"), ios::out, ios::trunc);
    for (int t = 0; t < time[0]; t++) {
        out << minBuyPrice[t] << "," << maxBuyPrice[t] << "," << minSellPrice[t] << "," << maxSellPrice[t] << "\n";
    }
    out.close();
    printf("End here 2");

    system("pause");
}