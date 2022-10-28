#include "Header.h"
class prosumer {
public:
	prosumer();
	std::string name;
	IloInt type;
	IloNum load;
	IloNum pv;
	IloNum bidBuy;
	IloNum bidSell;
	IloNum buyPrio;
	IloNum sellPrio;
};
prosumer::prosumer() {
	name = "";
	type = -1;
	load = 0;
	pv = 0;
	bidBuy = -1000;
	bidSell = 1000;
	buyPrio = 1000;
	sellPrio = 1000;
}
int main() {
	IloEnv env;

	std::vector<prosumer> listPro;
	IloNum buyMin, buyMax;
	IloNum sellMin, sellMax;
	IloNum pricceGS = 0.17, proiveGB = 0.57;

	std::filesystem::path cFile = std::filesystem::current_path();
	string cwd = cFile.string();
	std::filesystem::create_directories("broadcasted result");
	std::filesystem::create_directories("lagrange multiplier");
	char* fileProType = fileName(cwd, "Prosumer list");
	char* fileProLoad = fileName(cwd, "Power consumption");
	char* fileProPvkw = fileName(cwd, "Solar");
	char* fileBidRange = fileName(cwd + "\\bidding range", "bid range");
	char* fileRealBid = fileName(cwd + "\\customer bidding", "bidding");
	cout << fileRealBid << endl;

	IloCsvReader csvReader(env, fileProType);
	IloCsvReader::LineIterator lineIte(csvReader);
	IloCsvLine line = *lineIte;
	++lineIte;
	while (lineIte.ok()) {
		prosumer a;
		listPro.push_back(a);
		listPro[listPro.size() - 1].name = line.getStringByPosition(0);
		listPro[listPro.size() - 1].type = line.getIntByPosition(1);
		++lineIte;
	}
	csvReader = IloCsvReader(env, fileProLoad);
	lineIte = IloCsvReader::LineIterator(csvReader);
	line = *lineIte;
	while (lineIte.ok()) {
		string name = line.getStringByPosition(0);
		int i;
		for (i = 0; i < listPro.size(); i++)
			if (name == listPro[i].name)
				break;
		listPro[i].load = line.getFloatByPosition(1);
		++lineIte;
	}
	csvReader = IloCsvReader(env, fileRealBid);
	lineIte = IloCsvReader::LineIterator(csvReader);
	line = *lineIte;
	++lineIte;
	while (lineIte.ok()) {
		string name = line.getStringByPosition(0);
		int i;
		for (i = 0; i < listPro.size(); i++)
			if (name == listPro[i].name)
				break;
		if (line.getFloatByPosition(1) == 1)		listPro[i].bidSell = line.getFloatByPosition(2);
		else if (line.getFloatByPosition(1) == -1)		listPro[i].bidBuy = line.getFloatByPosition(2);
		//listPro[i].bidBuy = line.getFloatByPosition(1);
		//listPro[i].bidSell = line.getFloatByPosition(2);
		++lineIte;
	}
	csvReader = IloCsvReader(env, fileProPvkw);
	lineIte = IloCsvReader::LineIterator(csvReader);
	line = *lineIte;
	while (lineIte.ok()) {
		string name = line.getStringByPosition(0);
		int i;
		for (i = 0; i < listPro.size(); i++)
			if (name == listPro[i].name)
				break;
		listPro[i].pv = line.getFloatByPosition(1);
		++lineIte;
	}
	csvReader = IloCsvReader(env, fileBidRange);
	lineIte = IloCsvReader::LineIterator(csvReader);
	line = *lineIte;
	buyMin = line.getFloatByPosition(0);
	buyMax = line.getFloatByPosition(1);
	sellMin = line.getFloatByPosition(2);
	sellMax = line.getFloatByPosition(3);

	//for (int i = 0; i < listPro.size(); i++)
	//	cout << listPro[i].name << "\t" << listPro[i].type << "\t" << listPro[i].load << "\t" << listPro[i].pv << "\t" << listPro[i].bidBuy << "\t" << listPro[i].bidSell << endl;

	IloInt nbPro = listPro.size();
	IloNumArray prioBuy(env, nbPro);
	IloNumArray prioSell(env, nbPro);
	for (int i = 0; i < nbPro; i++) {
		prioBuy[i] = 1 - listPro[i].bidBuy / buyMax;
		prioSell[i] = listPro[i].bidSell / sellMax;
	}

	IloModel mod(env);
	IloCplex cplex(mod);
	IloExpr obj(env);

	IloNumArray netLoad(env, nbPro);
	for (int i = 0; i < nbPro; i++)
		netLoad[i] = listPro[i].load - listPro[i].pv;

	IloNumVarArray gridBuy(env, nbPro, 0, IloInfinity);
	IloNumVarArray gridSell(env, nbPro, 0, IloInfinity);
	IloNumVarArray p2pBuy(env, nbPro, 0, IloInfinity);
	IloNumVarArray p2pSell(env, nbPro, 0, IloInfinity);

	//set of constraints type
	IloRangeArray netTrade(env);
	IloRangeArray powerBalance(env);

	//objective function
	obj = gridBuy[0] - gridBuy[0];
	for (int i = 0; i < nbPro; i++)
		obj += p2pBuy[i] * prioBuy[i] + p2pSell[i] * prioSell[i] + gridBuy[i] + gridSell[i];

	//net trade = 0
	IloExpr buy(env), sell(env);
	buy = gridBuy[0] - gridBuy[0];
	sell = gridBuy[0] - gridBuy[0];
	for (int i = 0; i < nbPro; i++) {
		buy += p2pBuy[i];
		sell += p2pSell[i];
	}
	netTrade.add(IloRange(env, 0, buy - sell, 0, "netTrade"));

	//power balace
	for (int i = 0; i < nbPro; i++)
		powerBalance.add(IloRange(env, netLoad[i], p2pBuy[i] + gridBuy[i] - p2pSell[i] - gridSell[i], netLoad[i], name("power balance", i)));

	mod.add(netTrade);
	mod.add(powerBalance);
	mod.add(IloMinimize(env, obj));
	cplex.solve();
	std::cout << "status : " << cplex.getStatus() << endl;
	std::cout << "Objective value : " << cplex.getObjValue() << endl;
	IloNumArray solGridBuy(env);						cplex.getValues(gridBuy, solGridBuy);
	IloNumArray solGridSell(env);						cplex.getValues(gridSell, solGridSell);
	IloNumArray solP2pBuy(env);						cplex.getValues(p2pBuy, solP2pBuy);
	IloNumArray solP2pSell(env);						cplex.getValues(p2pSell, solP2pSell);
	IloNumArray slackNetTrade(env);				cplex.getSlacks(slackNetTrade, netTrade);
	IloNumArray slackPowerBalance(env);			cplex.getSlacks(slackPowerBalance, powerBalance);
	IloNumArray lagNetTrade(env);					cplex.getDuals(lagNetTrade, netTrade);
	IloNumArray lagPowerBalance(env);				cplex.getDuals(lagPowerBalance, powerBalance);
	IloNumArray rCostGB(env, nbPro);				cplex.getReducedCosts(rCostGB, gridBuy);
	IloNumArray rCostGS(env, nbPro);				cplex.getReducedCosts(rCostGS, gridSell);
	IloNumArray rCostp2pBuy(env, nbPro);		cplex.getReducedCosts(rCostp2pBuy, p2pBuy);
	IloNumArray rCostp2pSell(env, nbPro);		cplex.getReducedCosts(rCostp2pSell, p2pSell);
	/**********************************
	*				       primal result                 *
	***********************************/
	ofstream out;
	out.open(fileName("broadcasted result", "power"), ios::out, ios::trunc);
	out << std::setprecision(10);
	for (int i = 0; i < nbPro; i++)
		out << solGridBuy[i] << "," << solGridSell[i] << "," << solP2pBuy[i] << "," << solP2pSell[i] << "\n";
	out.close();
	out.open(fileName("broadcasted result", "prio"), ios::out, ios::trunc);
	out << std::setprecision(10);
	for (int i = 0; i < nbPro; i++)
		out << prioBuy[i] << "," << prioSell[i] << "\n";
	out.close();
	out.open(fileName("broadcasted result", "netLoad"), ios::out, ios::trunc);
	out << std::setprecision(10);
	for (int i = 0; i < nbPro; i++)
		out << netLoad[i] << "\n";
	out.close();
	/**********************************
	*				        dual result                   *
	***********************************/
	out.open(fileName("lagrange multiplier", "power balance"), ios::out, ios::trunc);
	out << std::setprecision(10);
	for (int i = 0; i < lagPowerBalance.getSize(); i++)
		out << lagPowerBalance[i] << "," << slackPowerBalance[i] << "\n";
	out.close();
	out.open(fileName("lagrange multiplier", "netTrade"), ios::out, ios::trunc);
	out << std::setprecision(10);
	out << lagNetTrade[0] << "," << slackNetTrade[0] << "\n";
	out.close();
	out.open(fileName("lagrange multiplier", "rCost"), ios::out, ios::trunc);
	out << std::setprecision(10);
	for (int i = 0; i < nbPro; i++)
		out << rCostGB[i] << "," << rCostGS[i] << "," << rCostp2pBuy[i] << "," << rCostp2pSell[i] << "\n";
	out.close();
	system("pause");
}