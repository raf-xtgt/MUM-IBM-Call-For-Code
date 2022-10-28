#pragma once
#include <ilcplex/ilocplex.h>
#include <ilconcert/ilocsvreader.h>
#include <math.h>
#include <typeinfo>
#include <iostream>
#include <fstream>
#include <string>
#include <stdlib.h>
#include <vector>
#include <filesystem>

using namespace std;

template<typename T>
int idx(T const& t) { return *static_cast<int*>(t.getObject()); }

typedef IloArray<IloNumExprArray> IloNumExpr2D;
typedef IloArray<IloIntExprArray> IloIntExpr2D;
typedef IloArray<IloNumVarArray> IloNumVar2D;
typedef IloArray<IloIntVarArray> IloIntVar2D;
typedef IloArray<IloNumArray> IloNum2D;
typedef IloArray<IloIntArray> IloInt2D;

typedef IloArray<IloNumExpr2D> IloNumExpr3D;
typedef IloArray<IloIntExpr2D> IloIntExpr3D;
typedef IloArray<IloNumVar2D> IloNumVar3D;
typedef IloArray<IloIntVar2D> IloIntVar3D;
typedef IloArray<IloNum2D> IloNum3D;
typedef IloArray<IloInt2D> IloInt3D;

//more general get value method for multi-dimention variable
void IloGetValues(IloCplex cplex, IloNum* val, const IloNumVar var);
void IloGetValues(IloCplex cplex, IloNum* val, const IloNumVar var);
void IloGetValues(IloCplex cplex, IloNumArray* val, const IloNumVarArray var);
void IloGetValues(IloCplex cplex, IloNumArray* val, const IloNumVarArray var);
void IloGetValues(IloCplex cplex, IloNum2D* val, const IloNumVar2D var);
void IloGetValues(IloCplex cplex, IloNum2D* val, const IloIntVar2D var);
void IloGetValues(IloCplex cplex, IloNum2D* val, const IloNumVar2D var);
void IloGetValues(IloCplex cplex, IloNum2D* val, const IloIntVar2D var);
void IloGetValues(IloCplex cplex, IloNum2D* val, const IloNumExpr2D var);
void IloGetValues(IloCplex cplex, IloNum3D* val, const IloIntVar3D var);
void IloGetValues(IloCplex cplex, IloNum3D* val, const IloIntVar3D var);
void IloGetValues(IloCplex cplex, IloNum2D* val, const IloNumExpr3D var);

void IloGetReduced(IloCplex cplex, IloNum2D* val, const IloNumVar2D var);


//set variable name for debugging
char* name(string in, int i);
char* name(string in, int i, int j);
char* name(string in, int i, int j, int k);

//set file path and file name
char* fileName(string folderName, string fileName, string namePro, int nbSH);
char* fileName(string folderName, string fileName, int nbSH);
char* fileName(string folderName, string fileName);
char* fileName(string folderName);

std::vector<int> generateIndice(IloInt, IloInt, IloInt);

//construct many type of 2D array
IloNum2D Ilo2dNumConstruct(IloEnv env, IloInt len1, IloInt len2);
IloNum2D Ilo2dNumConstruct(IloEnv env, IloInt len1, std::vector<int> len2);

IloNumVar2D Ilo2dNumVarConstruct(IloEnv env, IloInt len1, IloInt len2);
IloNumVar2D Ilo2dNumVarConstruct(IloEnv env, IloInt len1, std::vector<int> len2);
//IloNumVar2D Ilo2dNumVarConstruct(IloEnv env, std::vector<int> len1, IloInt len2);

IloNumVar2D Ilo2dNumVarConstruct(IloEnv env, IloInt len1, IloInt len2, IloInt mode);
IloNumVar2D Ilo2dNumVarConstruct(IloEnv env, IloInt len1, std::vector<int> len2, IloInt mode);
//IloNumVar2D Ilo2dNumVarConstruct(IloEnv env, std::vector<int> len1,IloInt len2, IloInt mode);
//name version
IloNumVar2D Ilo2dNumVarConstruct(IloEnv env, IloInt len1, IloInt len2, string name);
IloNumVar2D Ilo2dNumVarConstruct(IloEnv env, IloInt len1, std::vector<int> len2, string name);
//IloNumVar2D Ilo2dNumVarConstruct(IloEnv env, std::vector<int> len1, IloInt len2, string name);

IloNumVar2D Ilo2dNumVarConstruct(IloEnv env, IloInt len1, IloInt len2, IloInt mode, string name);
IloNumVar2D Ilo2dNumVarConstruct(IloEnv env, IloInt len1, std::vector<int> len2, IloInt mode, string name);
//IloNumVar2D Ilo2dNumVarConstruct(IloEnv env, std::vector<int> len1, IloInt len2, IloInt mode, string name);

IloNumExpr2D Ilo2dNumExprConstruct(IloEnv env, IloInt len1, IloInt len2);
IloNumExpr2D Ilo2dNumExprConstruct(IloEnv env, IloInt len1, std::vector<int> len2);

//construct many type of 3D array
IloNum3D Ilo3dNumConstrcut(IloEnv env, IloInt len1, std::vector<int> len2, std::vector<int> len3);
IloNum3D Ilo3dNumConstrcut(IloEnv env, IloInt len1, std::vector<int> len2, IloInt len3);
IloNum3D Ilo3dNumConstrcut(IloEnv env, IloInt len1, IloInt len2, IloInt len3);

IloNumVar3D Ilo3dNumVarConstrcut(IloEnv env, IloInt len1, IloInt len2, IloInt len3);
IloNumVar3D Ilo3dNumVarConstrcut(IloEnv env, IloInt len1, IloInt len2, IloInt len3, IloInt mode);
IloNumVar3D Ilo3dNumVarConstrcut(IloEnv env, IloInt len1, IloInt len2, IloInt len3, IloInt mode, string name);

IloNumVar3D Ilo3dNumVarConstrcut(IloEnv env, IloInt len1, std::vector<int> len2, IloInt len3);
IloNumVar3D Ilo3dNumVarConstrcut(IloEnv env, IloInt len1, std::vector<int> len2, IloInt len3, IloInt mode);
IloNumVar3D Ilo3dNumVarConstrcut(IloEnv env, IloInt len1, std::vector<int> len2, IloInt len3, IloInt mode, string name);

//sum method for 2D array
ILO_EXPORTEDFUNCTION(IloNumExprArg) Ilo2Sum(const IloNumExpr2D exprs);
ILO_EXPORTEDFUNCTION(IloIntExprArg) Ilo2Sum(const IloIntExpr2D exprs);
ILO_EXPORTEDFUNCTION(IloNumExprArg) Ilo2Sum(const IloNumVar2D exprs); //COMPAT
ILO_EXPORTEDFUNCTION(IloIntExprArg) Ilo2Sum(const IloIntVar2D exprs); //COMPAT
ILO_EXPORTEDFUNCTION(IloNum) Ilo2Sum(const IloNum2D values);
ILO_EXPORTEDFUNCTION(IloInt) Ilo2Sum(const IloInt2D values);


// Function # 1 : Count Number of Rows from Excel Files
/*=========================================================================================================================*/
inline int Count_Rows(char* DataLocation)
{
	IloEnv Count;

	char* Data_Location = (char*)DataLocation;

	IloCsvReader Generator_Data(Count, Data_Location);
	IloCsvReader::LineIterator  L_Count(Generator_Data); // Assign Line Number as L1 
	++L_Count; // Increment by 1 to ignore headers

	int Number_Rows = 0;

	while (L_Count.ok())
	{
		++L_Count;
		Number_Rows += 1;
	}
	return Number_Rows;

	Count.end();
}

// Function # 2 : Sort Array In Ascending Order
/*=========================================================================================================================*/

inline IloNumArray Sort(IloNumArray Array)
{
	IloNum S_T, S_TP1;

	IloInt ArraySize = Array.getSize();

	for (int i = 0; i < ArraySize; i++)
	{
		for (int j = 0; j < ArraySize - 1; j++)
		{
			S_T = Array[j];
			S_TP1 = Array[j + 1];

			if (S_T >= S_TP1)
			{
				//cout << "Swap It" << endl;
				Array[j] = S_TP1;
				Array[j + 1] = S_T;
			}
		}
	}

	return Array;
}

// Function # 3 : Random Float in a certain range.
/*=========================================================================================================================*/
inline float Random_Float(float min, float max)
{
	srand(time(0));

	float val = ((float)rand() / RAND_MAX) * (max - min) + min;

	return roundf(val * 100) / 100;
}

// Function # 4 : Shuffle Array
/*=========================================================================================================================*/
inline IloNumArray shuffle(IloNumArray Array)
{
	IloInt Pos_1, Pos_2;
	IloNum TempValue;

	IloInt ArraySize = Array.getSize();

	for (int i = 0; i < ArraySize; i++)
	{
		Pos_1 = rand() % ArraySize;
		Pos_2 = rand() % ArraySize;

		TempValue = Array[Pos_1];

		Array[Pos_1] = Array[Pos_2];
		Array[Pos_2] = TempValue;
	}

	return Array;
}

// Function # 5 : Print x Data per line.
/*=========================================================================================================================*/
inline void print(IloNumArray List, IloInt Amount)
{
	IloInt Size;
	Size = List.getSize();

	for (int i = 0; i < Size; i++)
	{
		if (i > 0 && i % Amount == 0)
		{
			cout << endl;
		}

		cout << List[i] << "	";
	}
}

// Function # 6 : Compare 2 int and return min value.
/*=========================================================================================================================*/
inline IloInt Min(IloInt x, IloInt y)
{
	return y ^ ((x ^ y) & -(x < y));
}

// Function # 7 : Commercial Tariff
/*=========================================================================================================================*/
inline IloNum CommercialTariff(IloNum Power)
{
	float TarrifPrice[2];
	float TarrifRange;

	IloNum TotalCost = 0;

	// Tariff Pricing
	TarrifPrice[0] = 0.435; TarrifRange = 200;
	TarrifPrice[1] = 0.509;

	if (Power > TarrifRange)
	{
		TotalCost += TarrifRange * TarrifPrice[0];

		Power = Power - TarrifRange;

		TotalCost += Power * TarrifPrice[1];
	}
	else
	{
		TotalCost += Power * TarrifPrice[0];
	}

	return TotalCost;
}

// Function # 8 : Residential Tariff
/*=========================================================================================================================*/
inline IloNum ResidentialTariff(IloNum Power)
{
	float TarrifPrice[5];
	float TarrifRange[4];

	IloInt J;

	IloNum TotalCost = 0;

	// Tariff Pricing
	TarrifPrice[0] = 0.218; TarrifRange[0] = 200;
	TarrifPrice[1] = 0.334; TarrifRange[1] = 100;
	TarrifPrice[2] = 0.516; TarrifRange[2] = 300;
	TarrifPrice[3] = 0.546; TarrifRange[3] = 300;
	TarrifPrice[4] = 0.571;

	for (int j = 0; j < 4; j++)
	{
		J = j;
		if (Power > 0)
		{
			TotalCost += TarrifRange[j] * TarrifPrice[j];

			Power = Power - TarrifRange[j];

			if (Power < 0)
			{
				TotalCost -= TarrifRange[j] * TarrifPrice[j];

				Power = Power + TarrifRange[j];
				break;
			}

			//cout << "j = " << j << endl;
			//cout << "total Cost  = " << TotalCostCity << endl;
			//cout << "Remaining = " << TempPowerConsumption << endl;
			//cout << endl;
		}
	}

	TotalCost += Power * TarrifPrice[J];

	return TotalCost;
}

// Function # 9 : Industrial Tariff
/*=========================================================================================================================*/
inline IloNum IndustrialTariff(IloNum Power)
{
	float TarrifPrice[2];
	float TarrifRange;

	IloInt J;

	IloNum TotalCost = 0;

	// Tariff Pricing
	TarrifPrice[0] = 0.380; TarrifRange = 200;
	TarrifPrice[1] = 0.441;

	if (Power > TarrifRange)
	{
		TotalCost += TarrifRange * TarrifPrice[0];

		Power = Power - TarrifRange;

		TotalCost += Power * TarrifPrice[1];
	}
	else
	{
		TotalCost += Power * TarrifPrice[0];
	}

	return TotalCost;
}

// Function # 10 : Convert Priority into Integer
/*=========================================================================================================================*/
inline IloNum2D Convert2Prio(IloNum2D PrioArray, IloNumArray ExcessArray, IloNum2D NetLoad, IloInt BuyOrSell)
{
	IloEnv Priority;

	// Get Number of prosumer and time step.
	IloInt nbSHsumer = PrioArray.getSize();
	IloInt nbHour = PrioArray[0].getSize();

	// Create Array
	IloNum2D OutputArray(Priority, nbHour);
	IloNumArray SortPrioArray(Priority, nbSHsumer);

	for (int i = 0; i < nbHour; i++)
	{
		OutputArray[i] = IloNumArray(Priority, nbSHsumer);

		for (int j = 0; j < nbSHsumer; j++)
		{
			// Obtain Data.
			OutputArray[i][j] = PrioArray[j][i];

			// Copy array
			SortPrioArray[j] = OutputArray[i][j];
		}

		// Sort the Priority
		SortPrioArray = Sort(SortPrioArray);

		// Allocate priority in integer to each customer.
		IloInt Counter;

		Counter = 1;
		if (BuyOrSell == 0)							// For Selling Priority
		{
			for (int j = 0; j < nbSHsumer; j++)
			{
				for (int k = 0; k < nbSHsumer; k++)
				{
					if (ExcessArray[i] > 0)
					{
						// For Buying Priority
						if (NetLoad[k][i] > 0)
						{
							if (SortPrioArray[j] == OutputArray[i][k])
							{
								//nbBuyPrio[i][k] = j + 1;
								OutputArray[i][k] = Counter;
								Counter += 1;
							}
						}

						else
						{
							OutputArray[i][k] = 0;
						}
					}

					else
					{
						OutputArray[i][k] = 0;
					}
				}
			}

		}

		else if (BuyOrSell == 1) 						// For Selling Priority
		{
			for (int j = 0; j < nbSHsumer; j++)
			{
				for (int k = 0; k < nbSHsumer; k++)
				{
					if (ExcessArray[i] > 0)
					{
						if (NetLoad[k][i] < 0)
						{
							if (SortPrioArray[j] == OutputArray[i][k])
							{
								//nbSellPrio[i][k] = j + 1;
								OutputArray[i][k] = Counter;
								Counter += 1;
							}
						}

						else
						{
							OutputArray[i][k] = 0;
						}
					}

					else
					{
						OutputArray[i][k] = 0;
					}
				}
			}
		}


	}

	return OutputArray;

	Priority.end();
}



ILO_EXPORTEDFUNCTION(IloNumExprArg) Ilo2Sum(const IloNumExpr2D exprs) {
	IloInt i; IloNumExpr a(exprs.getEnv());
	for (int i = 0; i < exprs.getSize(); i++) {
		a += IloSum(exprs[i]);
	}
	return a;
}
ILO_EXPORTEDFUNCTION(IloIntExprArg) Ilo2Sum(const IloIntExpr2D exprs) {
	IloInt i; IloIntExpr a(exprs.getEnv());
	for (int i = 0; i < exprs.getSize(); i++) {
		a += IloSum(exprs[i]);
	}
	return a;
}
ILO_EXPORTEDFUNCTION(IloNumExprArg) Ilo2Sum(const IloNumVar2D exprs) {
	IloInt i; IloNumExpr a(exprs.getEnv());
	for (int i = 0; i < exprs.getSize(); i++) {
		a += IloSum(exprs[i]);
	}
	return a;
}
ILO_EXPORTEDFUNCTION(IloIntExprArg) Ilo2Sum(const IloIntVar2D exprs) {
	IloInt i; IloIntExpr a(exprs.getEnv());
	for (int i = 0; i < exprs.getSize(); i++) {
		a += IloSum(exprs[i]);
	}
	return a;
}
ILO_EXPORTEDFUNCTION(IloNum) Ilo2Sum(const IloNum2D values) {
	IloInt i = 0; IloNum a;
	a = 0;
	for (int i = 0; i < values.getSize(); i++) {
		a += IloSum(values[i]);
	}
	return a;
}
ILO_EXPORTEDFUNCTION(IloInt) Ilo2Sum(const IloInt2D values) {
	IloInt i; IloInt a;
	a = 0;
	for (int i = 0; i < values.getSize(); i++) {
		a += IloSum(values[i]);
	}
	return a;
}

void IloGetReduced(IloCplex cplex, IloNum2D* val, const IloNumVar2D var) {
	for (int i = 0; i < var.getSize(); i++)
		for (int j = 0; j < var[i].getSize(); j++)
			cplex.getReducedCost(var[i][j]) < 0.00001 ? (*val)[i][j] = 0 : (*val)[i][j] = cplex.getReducedCost(var[i][j]);
}
void IloGetValues(IloCplex cplex, IloNum* val, const IloNumVar var) {
	abs(cplex.getValue(var)) < 0.00001 ? *val = 0 : *val = cplex.getValue(var);
}
void IloGetValues(IloCplex cplex, IloNum* val, const IloIntVar var) {
	abs(cplex.getValue(var)) < 0.00001 ? *val = 0 : *val = cplex.getValue(var);
}
void IloGetValues(IloCplex cplex, IloNumArray* val, const IloNumVarArray var) {
	for (int i = 0; i < var.getSize(); i++)
		abs(cplex.getValue(var[i])) < 0.00001 ? (*val)[i] = 0 : (*val)[i] = cplex.getValue(var[i]);
}
void IloGetValues(IloCplex cplex, IloNumArray* val, const IloIntVarArray var) {
	for (int i = 0; i < var.getSize(); i++)
		abs(cplex.getValue(var[i])) < 0.00001 ? (*val)[i] = 0 : (*val)[i] = cplex.getValue(var[i]);
}
void IloGetValues(IloCplex cplex, IloNum2D* val, const IloNumVar2D var) {
	for (int i = 0; i < var.getSize(); i++)
		for (int j = 0; j < var[i].getSize(); j++)
			abs(cplex.getValue(var[i][j])) < 0.00001 ? (*val)[i][j] = 0 : (*val)[i][j] = cplex.getValue(var[i][j]);
}
void IloGetValues(IloCplex cplex, IloNum2D* val, const IloIntVar2D var) {
	for (int i = 0; i < var.getSize(); i++)
		for (int j = 0; j < var[i].getSize(); j++)
			abs(cplex.getValue(var[i][j])) < 0.00001 ? (*val)[i][j] = 0 : (*val)[i][j] = cplex.getValue(var[i][j]);
}
void IloGetValues(IloCplex cplex, IloNum2D* val, const IloNumExpr2D var) {
	for (int i = 0; i < var.getSize(); i++)
		for (int j = 0; j < var[i].getSize(); j++)
			abs(cplex.getValue(var[i][j])) < 0.00001 ? (*val)[i][j] = 0 : (*val)[i][j] = cplex.getValue(var[i][j]);
}
void IloGetValues(IloCplex cplex, IloNum3D* val, const IloNumVar3D var) {
	for (int i = 0; i < var.getSize(); i++)
		for (int j = 0; j < var[i].getSize(); j++)
			for (int k = 0; k < var[i][j].getSize(); k++)
				abs(cplex.getValue(var[i][j][k])) < 0.00001 ? (*val)[i][j][k] = 0 : (*val)[i][j][k] = cplex.getValue(var[i][j][k]);
}
void IloGetValues(IloCplex cplex, IloNum3D* val, const IloIntVar3D var) {
	for (int i = 0; i < var.getSize(); i++)
		for (int j = 0; j < var[i].getSize(); j++)
			for (int k = 0; k < var[i][j].getSize(); k++)
				abs(cplex.getValue(var[i][j][k])) < 0.00001 ? (*val)[i][j][k] = 0 : (*val)[i][j][k] = cplex.getValue(var[i][j][k]);
}
void IloGetValues(IloCplex cplex, IloNum3D* val, const IloNumExpr3D var) {
	for (int i = 0; i < var.getSize(); i++)
		for (int j = 0; j < var[i].getSize(); j++)
			for (int k = 0; k < var[i][j].getSize(); k++)
				abs(cplex.getValue(var[i][j][k])) < 0.00001 ? (*val)[i][j][k] = 0 : (*val)[i][j][k] = cplex.getValue(var[i][j][k]);
}

std::vector<int> generateIndice(IloInt len1, IloInt len2, IloInt len3) {
	std::vector<int> obj; int acc = 0;
	for (int i = 0; i < len1; i++) {
		for (int j = 0; j < len2; j++) {
			for (int k = 0; k < len3; k++) {
				obj.push_back(acc);
				acc++;
			}
		}
	}
	return obj;
}



char* name(string in, int i) {
	char* varName = new char[100];
	const char* ins = in.c_str();
	sprintf(varName, "%s[%d]", ins, (int)i + 1);
	return varName;
}
char* name(string in, int i, int j) {
	char* varName = new char[100];
	const char* ins = in.c_str();
	sprintf(varName, "%s[%d][%d]", ins, (int)i + 1, (int)j + 1);
	return varName;
}
char* name(string in, int i, int j, int k) {
	char* varName = new char[100];
	const char* ins = in.c_str();
	sprintf(varName, "%s[%d][%d][%d]", ins, (int)i + 1, (int)j + 1, (int)k + 1);
	return varName;
}
char* fileName(string folderName, string fileName, string namePro, int nbSH) {
	char* varName = new char[150];
	const char* cFolder = folderName.c_str();
	const char* cFile = fileName.c_str();
	const char* cName = namePro.c_str();
	sprintf(varName, "%s/%s%s%d.csv", cFolder, cFile, cName, nbSH + 1);
	return varName;
}
char* fileName(string folderName, string fileName, int nbSH) {
	char* varName = new char[150];
	const char* cFolder = folderName.c_str();
	const char* cFile = fileName.c_str();
	sprintf(varName, "%s/%s%d.csv", cFolder, cFile, nbSH + 1);
	return varName;
}
char* fileName(string folderName, string fileName) {
	char* varName = new char[200];
	const char* cFolder = folderName.c_str();
	const char* cFile = fileName.c_str();
	sprintf(varName, "%s/%s.csv", cFolder, cFile);
	return varName;
}
char* fileName(string fileName) {
	char* varName = new char[150];
	const char* cFile = fileName.c_str();
	sprintf(varName, "%s.csv", cFile);
	return varName;
}

IloNum2D Ilo2dNumConstruct(IloEnv env, IloInt len1, IloInt len2) {
	IloNum2D* ptr;
	ptr = new IloNum2D(env, len1);
	for (int i = 0; i < len1; i++)
		(*ptr)[i] = IloNumArray(env, len2);
	return *ptr;
}
IloNum2D Ilo2dNumConstruct(IloEnv env, IloInt len1, std::vector<int> len2) {
	IloNum2D* ptr;
	ptr = new IloNum2D(env, len1);
	for (int i = 0; i < len1; i++)
		(*ptr)[i] = IloNumArray(env, len2[i]);
	return *ptr;
}

IloNumVar2D Ilo2dNumVarConstruct(IloEnv env, IloInt len1, IloInt len2) {
	IloNumVar2D* ptr;
	ptr = new IloNumVar2D(env, len1);
	for (int i = 0; i < len1; i++)
		(*ptr)[i] = IloNumVarArray(env, len2, -IloInfinity, IloInfinity);
	return *ptr;
}
IloNumVar2D Ilo2dNumVarConstruct(IloEnv env, IloInt len1, std::vector<int> len2) {
	IloNumVar2D* ptr;
	ptr = new IloNumVar2D(env, len1);
	for (int i = 0; i < len1; i++)
		(*ptr)[i] = IloNumVarArray(env, len2[i], -IloInfinity, IloInfinity);
	return *ptr;
}

IloNumVar2D Ilo2dNumVarConstruct(IloEnv env, IloInt len1, IloInt len2, IloInt mode) {
	IloNumVar2D* ptr;
	ptr = new IloNumVar2D(env, len1);
	for (int i = 0; i < len1; i++) {
		if (mode == 0)
			(*ptr)[i] = IloNumVarArray(env, len2, -IloInfinity, IloInfinity);
		else if (mode == 1)
			(*ptr)[i] = IloNumVarArray(env, len2, 0, IloInfinity);
		else if (mode == 2)
			(*ptr)[i] = IloNumVarArray(env, len2, -IloInfinity, 0);
	}
	return *ptr;
}
IloNumVar2D Ilo2dNumVarConstruct(IloEnv env, IloInt len1, std::vector<int> len2, IloInt mode) {
	IloNumVar2D* ptr;
	ptr = new IloNumVar2D(env, len1);
	for (int i = 0; i < len1; i++) {
		if (mode == 0)
			(*ptr)[i] = IloNumVarArray(env, len2[i], -IloInfinity, IloInfinity);
		else if (mode == 1)
			(*ptr)[i] = IloNumVarArray(env, len2[i], 0, IloInfinity);
		else if (mode == 2)
			(*ptr)[i] = IloNumVarArray(env, len2[i], -IloInfinity, 0);
	}
	return *ptr;
}

//name version
IloNumVar2D Ilo2dNumVarConstruct(IloEnv env, IloInt len1, IloInt len2, string vName) {
	IloNumVar2D* ptr;
	ptr = new IloNumVar2D(env, len1);
	for (int i = 0; i < len1; i++)
		(*ptr)[i] = IloNumVarArray(env, len2, -IloInfinity, IloInfinity);
	for (int i = 0; i < len1; i++) {
		for (int j = 0; j < len2; j++) {
			(*ptr)[i][j].setName(name(vName, i, j));
		}
	}
	return *ptr;
}
IloNumVar2D Ilo2dNumVarConstruct(IloEnv env, IloInt len1, std::vector<int> len2, string vName) {
	IloNumVar2D* ptr;
	ptr = new IloNumVar2D(env, len1);
	for (int i = 0; i < len1; i++)
		(*ptr)[i] = IloNumVarArray(env, len2[i], -IloInfinity, IloInfinity);
	for (int i = 0; i < len1; i++) {
		for (int j = 0; j < len2[i]; j++) {
			(*ptr)[i][j].setName(name(vName, i, j));
		}
	}
	return *ptr;
}
IloNumVar2D Ilo2dNumVarConstruct(IloEnv env, IloInt len1, IloInt len2, IloInt mode, string vName) {
	IloNumVar2D* ptr;
	ptr = new IloNumVar2D(env, len1);
	for (int i = 0; i < len1; i++) {
		if (mode == 0)
			(*ptr)[i] = IloNumVarArray(env, len2, -IloInfinity, IloInfinity);
		else if (mode == 1)
			(*ptr)[i] = IloNumVarArray(env, len2, 0, IloInfinity);
		else if (mode == 2)
			(*ptr)[i] = IloNumVarArray(env, len2, -IloInfinity, 0);
	}
	for (int i = 0; i < len1; i++) {
		for (int j = 0; j < len2; j++) {
			(*ptr)[i][j].setName(name(vName, i, j));
		}
	}
	return *ptr;
}
IloNumVar2D Ilo2dNumVarConstruct(IloEnv env, IloInt len1, std::vector<int> len2, IloInt mode, string vName) {
	IloNumVar2D* ptr;
	ptr = new IloNumVar2D(env, len1);
	for (int i = 0; i < len1; i++) {
		if (mode == 0)
			(*ptr)[i] = IloNumVarArray(env, len2[i], -IloInfinity, IloInfinity);
		else if (mode == 1)
			(*ptr)[i] = IloNumVarArray(env, len2[i], 0, IloInfinity);
		else if (mode == 2)
			(*ptr)[i] = IloNumVarArray(env, len2[i], -IloInfinity, 0);
	}
	for (int i = 0; i < len1; i++) {
		for (int j = 0; j < len2[i]; j++) {
			(*ptr)[i][j].setName(name(vName, i, j));
		}
	}
	return *ptr;
}

IloNumExpr2D Ilo2dNumExprConstruct(IloEnv env, IloInt len1, IloInt len2) {
	IloNumExpr2D* ptr;
	ptr = new IloNumExpr2D(env, len1);
	for (int i = 0; i < len1; i++) {
		(*ptr)[i] = IloNumExprArray(env, len2);
		for (int j = 0; j < len2; j++)
			(*ptr)[i][j] = IloExpr(env);

	}
	return *ptr;
}
IloNumExpr2D Ilo2dNumExprConstruct(IloEnv env, IloInt len1, std::vector<int> len2) {
	IloNumExpr2D* ptr;
	ptr = new IloNumExpr2D(env, len1);
	for (int i = 0; i < len1; i++) {
		(*ptr)[i] = IloNumExprArray(env, len2[i]);
		for (int j = 0; j < len2[i]; j++)
			(*ptr)[i][j] = IloExpr(env);

	}
	return *ptr;
}


IloNum3D Ilo3dNumConstrcut(IloEnv env, IloInt len1, std::vector<int> len2, std::vector<int> len3) {
	IloNum3D* ptr;
	ptr = new IloNum3D(env, len1);
	for (int i = 0; i < len1; i++) {
		(*ptr)[i] = IloNum2D(env, len2[i]);
		for (int j = 0; j < len2[i]; j++)
			(*ptr)[i][j] = IloNumArray(env, len3[j]);

	}
	return *ptr;
}
IloNum3D Ilo3dNumConstrcut(IloEnv env, IloInt len1, std::vector<int> len2, IloInt len3) {
	IloNum3D* ptr;
	ptr = new IloNum3D(env, len1);
	for (int i = 0; i < len1; i++) {
		(*ptr)[i] = IloNum2D(env, len2[i]);
		for (int j = 0; j < len2[i]; j++)
			(*ptr)[i][j] = IloNumArray(env, len3);

	}
	return *ptr;
}
IloNum3D Ilo3dNumConstrcut(IloEnv env, IloInt len1, IloInt len2, IloInt len3) {
	IloNum3D* ptr;
	ptr = new IloNum3D(env, len1);
	for (int i = 0; i < len1; i++) {
		(*ptr)[i] = IloNum2D(env, len2);
		for (int j = 0; j < len2; j++)
			(*ptr)[i][j] = IloNumArray(env, len3);
	}
	return *ptr;
}

IloNumVar3D Ilo3dNumVarConstrcut(IloEnv env, IloInt len1, IloInt len2, IloInt len3) {
	IloNumVar3D* ptr;
	ptr = new IloNumVar3D(env, len1);
	for (int i = 0; i < len1; i++) {
		(*ptr)[i] = IloNumVar2D(env, len2);
		for (int j = 0; j < len2; j++)
			(*ptr)[i][j] = IloNumVarArray(env, len3, -IloInfinity, IloInfinity);

	}
	return *ptr;
}
IloNumVar3D Ilo3dNumVarConstrcut(IloEnv env, IloInt len1, IloInt len2, IloInt len3, IloInt mode) {
	IloNumVar3D* ptr;
	ptr = new IloNumVar3D(env, len1);
	for (int i = 0; i < len1; i++) {
		(*ptr)[i] = IloNumVar2D(env, len2);
		for (int j = 0; j < len2; j++) {
			if (mode == 0)
				(*ptr)[i][j] = IloNumVarArray(env, len3, -IloInfinity, IloInfinity);
			else if (mode == 1)
				(*ptr)[i][j] = IloNumVarArray(env, len3, 0, IloInfinity);
			else if (mode == 2)
				(*ptr)[i][j] = IloNumVarArray(env, len3, -IloInfinity, 0);
		}

	}
	return *ptr;
}
IloNumVar3D Ilo3dNumVarConstrcut(IloEnv env, IloInt len1, IloInt len2, IloInt len3, IloInt mode, string vName) {
	IloNumVar3D* ptr;
	ptr = new IloNumVar3D(env, len1);
	for (int i = 0; i < len1; i++) {
		(*ptr)[i] = IloNumVar2D(env, len2);
		for (int j = 0; j < len2; j++) {
			if (mode == 0)
				(*ptr)[i][j] = IloNumVarArray(env, len3, -IloInfinity, IloInfinity);
			else if (mode == 1)
				(*ptr)[i][j] = IloNumVarArray(env, len3, 0, IloInfinity);
			else if (mode == 2)
				(*ptr)[i][j] = IloNumVarArray(env, len3, -IloInfinity, 0);
		}
	}
	for (int i = 0; i < len1; i++) {
		for (int j = 0; j < len2; j++) {
			for (int k = 0; k < len3; k++) {
				(*ptr)[i][j][k].setName(name(vName, i, j, k));
			}
		}
	}
	return *ptr;
}

IloNumVar3D Ilo3dNumVarConstrcut(IloEnv env, IloInt len1, std::vector<int> len2, IloInt len3) {
	IloNumVar3D* ptr;
	ptr = new IloNumVar3D(env, len1);
	for (int i = 0; i < len1; i++) {
		(*ptr)[i] = IloNumVar2D(env, len2[i]);
		for (int j = 0; j < len2[i]; j++)
			(*ptr)[i][j] = IloNumVarArray(env, len3, -IloInfinity, IloInfinity);

	}
	return *ptr;
}
IloNumVar3D Ilo3dNumVarConstrcut(IloEnv env, IloInt len1, std::vector<int> len2, IloInt len3, IloInt mode) {
	IloNumVar3D* ptr;
	ptr = new IloNumVar3D(env, len1);
	for (int i = 0; i < len1; i++) {
		(*ptr)[i] = IloNumVar2D(env, len2[i]);
		for (int j = 0; j < len2[i]; j++) {
			if (mode == 0)
				(*ptr)[i][j] = IloNumVarArray(env, len3, -IloInfinity, IloInfinity);
			else if (mode == 1)
				(*ptr)[i][j] = IloNumVarArray(env, len3, 0, IloInfinity);
			else if (mode == 2)
				(*ptr)[i][j] = IloNumVarArray(env, len3, -IloInfinity, 0);
		}

	}
	return *ptr;
}
IloNumVar3D Ilo3dNumVarConstrcut(IloEnv env, IloInt len1, std::vector<int> len2, IloInt len3, IloInt mode, string vName) {
	IloNumVar3D* ptr;
	ptr = new IloNumVar3D(env, len1);
	for (int i = 0; i < len1; i++) {
		(*ptr)[i] = IloNumVar2D(env, len2[i]);
		for (int j = 0; j < len2[i]; j++) {
			if (mode == 0)
				(*ptr)[i][j] = IloNumVarArray(env, len3, -IloInfinity, IloInfinity);
			else if (mode == 1)
				(*ptr)[i][j] = IloNumVarArray(env, len3, 0, IloInfinity);
			else if (mode == 2)
				(*ptr)[i][j] = IloNumVarArray(env, len3, -IloInfinity, 0);
		}
	}
	for (int i = 0; i < len1; i++) {
		for (int j = 0; j < len2[i]; j++) {
			for (int k = 0; k < len3; k++) {
				(*ptr)[i][j][k].setName(name(vName, i, j, k));
			}
		}
	}
	return *ptr;
}

