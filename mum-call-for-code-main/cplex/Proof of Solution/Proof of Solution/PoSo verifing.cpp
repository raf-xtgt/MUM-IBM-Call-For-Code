#include "Header.h"
#define TOL 1e-6
int main() {

	bool flag = true;

	IloEnv env;
	std::filesystem::create_directories("KKT result");
	IloNumArray gridBuy(env);
	IloNumArray gridSell(env);
	IloNumArray p2pBuy(env);
	IloNumArray p2pSell(env);
	IloNumArray netLoad(env);
	IloNumArray prioSell(env);
	IloNumArray prioBuy(env);
	IloNumArray slackNetTrade(env);
	IloNumArray slackPowerBalance(env);
	IloNumArray lagNetTrade(env);
	IloNumArray lagPowerBalance(env);
	IloNumArray rCostGB(env);
	IloNumArray rCostGS(env);
	IloNumArray rCostp2pBuy(env);
	IloNumArray rCostp2pSell(env);
	std::filesystem::path cFile = std::filesystem::current_path();
	string cwd = cFile.string();
	std::replace(cwd.begin(), cwd.end(), '\\', '/');
	char* filePOR = fileName(cwd + "/broadcasted result", "power");
	char* fileNT = fileName(cwd + "/broadcasted result", "netLoad");
	char* filePRIO = fileName(cwd + "/broadcasted result", "prio");
	char* fileDNT = fileName(cwd + "/lagrange multiplier", "netTrade");
	char* fileDPB = fileName(cwd + "/lagrange multiplier", "power balance");
	char* fileRCO = fileName(cwd + "/lagrange multiplier", "rCost");
	IloCsvReader csvReader(env, filePOR);
	IloCsvReader::LineIterator lineIte(csvReader);
	IloCsvLine line = *lineIte;
	while (lineIte.ok()) {
		gridBuy.add(line.getFloatByPosition(0));
		gridSell.add(line.getFloatByPosition(1));
		p2pBuy.add(line.getFloatByPosition(2));
		p2pSell.add(line.getFloatByPosition(3));
		++lineIte;
	}
	csvReader = IloCsvReader(env, fileNT);
	lineIte = IloCsvReader::LineIterator(csvReader);
	line = *lineIte;
	while (lineIte.ok()) {
		netLoad.add(line.getFloatByPosition(0));
		++lineIte;
	}
	csvReader = IloCsvReader(env, filePRIO);
	lineIte = IloCsvReader::LineIterator(csvReader);
	line = *lineIte;
	while (lineIte.ok()) {
		prioBuy.add(line.getFloatByPosition(0));
		prioSell.add(line.getFloatByPosition(1));
		++lineIte;
	}
	csvReader = IloCsvReader(env, fileDNT);
	lineIte = IloCsvReader::LineIterator(csvReader);
	line = *lineIte;
	while (lineIte.ok()) {
		lagNetTrade.add(line.getFloatByPosition(0));
		slackNetTrade.add(line.getFloatByPosition(1));
		++lineIte;
	}
	csvReader = IloCsvReader(env, fileDPB);
	lineIte = IloCsvReader::LineIterator(csvReader);
	line = *lineIte;
	while (lineIte.ok()) {
		lagPowerBalance.add(line.getFloatByPosition(0));
		slackPowerBalance.add(line.getFloatByPosition(1));
		++lineIte;
	}
	csvReader = IloCsvReader(env, fileRCO);
	lineIte = IloCsvReader::LineIterator(csvReader);
	line = *lineIte;
	while (lineIte.ok()) {
		rCostGB.add(line.getFloatByPosition(0));
		rCostGS.add(line.getFloatByPosition(1));
		rCostp2pBuy.add(line.getFloatByPosition(2));
		rCostp2pSell.add(line.getFloatByPosition(3));
		++lineIte;
	}
	/**********************************
	 *				       Strong Dual                  *
	 **********************************/
	int nbPro = netLoad.getSize();
	IloNum primalObj = 0, dualObj = 0;
	for (int i = 0; i < nbPro; i++)
		primalObj += p2pBuy[i] * prioBuy[i] + p2pSell[i] * prioSell[i] + gridBuy[i] + gridSell[i];
	for (int i = 0; i < nbPro; i++)
		dualObj += lagPowerBalance[i] * netLoad[i];
	std::cout << "primalObj : " << primalObj << std::endl;
	std::cout << "dualObj    : " << dualObj << std::endl;
	if (abs(primalObj - dualObj) >= TOL) flag = false;
	/**********************************
	 *				   primal feasible                  *
	 **********************************/
	 //power balance
	for (int i = 0; i < nbPro; i++) {
		if (abs(p2pBuy[i] + gridBuy[i] - p2pSell[i] - gridSell[i] - netLoad[i]) > TOL) {
			std::cout << "violate power balance constaint at";
			std::cout << " prosumer : " << i + 1 << std::endl;
			flag = false;
		}
	}
	//net trade
	IloNum buy = 0, sell = 0;
	for (int i = 0; i < nbPro; i++) {
		buy += p2pBuy[i];
		sell += p2pSell[i];
	}
	if (abs(buy - sell) > TOL) {
		std::cout << "violate net trade constaint";
		flag = false;
	}
	/**********************************
	 *				   no feaible decent              *
	 **********************************/
	IloNumArray kktSum(env, 4 * nbPro);
	std::vector<int> indice = generateIndice(4, nbPro);
	//set up original obj
	IloExpr obj(env);
	IloNumVarArray varGridBuy(env, nbPro, 0, IloInfinity);
	IloNumVarArray varGridSell(env, nbPro, 0, IloInfinity);
	IloNumVarArray varP2pBuy(env, nbPro, 0, IloInfinity);
	IloNumVarArray varP2pSell(env, nbPro, 0, IloInfinity);
	for (int i = 0; i < nbPro; i++) {
		varGridBuy[i].setObject(&indice[0 * nbPro + i]);
		varGridSell[i].setObject(&indice[1 * nbPro + i]);
		varP2pBuy[i].setObject(&indice[2 * nbPro + i]);
		varP2pSell[i].setObject(&indice[3 * nbPro + i]);
	}

	//set of constraints type
	IloRangeArray netTrade(env);
	IloRangeArray powerBalance(env);

	//objective function
	obj = varGridBuy[0] - varGridBuy[0];
	for (int i = 0; i < nbPro; i++)
		obj += varP2pBuy[i] * prioBuy[i] + varP2pSell[i] * prioSell[i] + varGridBuy[i] + varGridSell[i];

	//net trade = 0
	IloExpr buy1(env), sell1(env);
	buy1 = varGridBuy[0] - varGridBuy[0];
	sell1 = varGridBuy[0] - varGridBuy[0];
	for (int i = 0; i < nbPro; i++) {
		buy1 += varP2pBuy[i];
		sell1 += varP2pSell[i];
	}
	netTrade.add(IloRange(env, 0, buy1 - sell1, 0, "netTrade"));

	//power balace
	for (int i = 0; i < nbPro; i++)
		powerBalance.add(IloRange(env, netLoad[i], varP2pBuy[i] + varGridBuy[i] - varP2pSell[i] - varGridSell[i], netLoad[i], name("power balance", i)));

	for (IloExpr::LinearIterator it = obj.getLinearIterator(); it.ok(); ++it)
		kktSum[idx(it.getVar())] = it.getCoef();
	//power balance constraints
	for (int i = 0; i < powerBalance.getSize(); i++)
		for (IloExpr::LinearIterator it = powerBalance[i].getLinearIterator(); it.ok(); ++it)
			kktSum[idx(it.getVar())] -= lagPowerBalance[i] * it.getCoef();
	//net trade
	for (int i = 0; i < netTrade.getSize(); i++)
		for (IloExpr::LinearIterator it = netTrade[i].getLinearIterator(); it.ok(); ++it)
			kktSum[idx(it.getVar())] -= lagNetTrade[i] * it.getCoef();
	for (int i = 0; i < nbPro; i++) {
		kktSum[0 * nbPro + i] -= rCostGB[i];
		kktSum[1 * nbPro + i] -= rCostGS[i];
		kktSum[2 * nbPro + i] -= rCostp2pBuy[i];
		kktSum[3 * nbPro + i] -= rCostp2pSell[i];
	}
	for (int i = 0; i < 4 * nbPro; i++) {
		if (abs(kktSum[i]) > TOL) {
			int type, pro;
			type = i / (nbPro);
			pro = i % nbPro;
			std::cout << "Feasible gradient fail at ";
			std::cout << "constarint type : " << type;
			std::cout << "prosumer : " << pro;
			flag = false;
		}
	}
	ofstream out;
	out.open(fileName("KKT result", "KKT_Result"), ios::out, ios::trunc);
	out << flag << endl;
	out.close();

	system("pause");
}