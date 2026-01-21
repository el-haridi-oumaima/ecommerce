#!/bin/bash

# ✅ Script de vérification - Plateforme E-commerce
# Vérifie que tous les fichiers sont en place et l'app est prête

echo "======================================"
echo "✅ VÉRIFICATION DU PROJET"
echo "======================================"
echo ""

ERRORS=0
WARNINGS=0

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour vérifier les fichiers
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
    else
        echo -e "${RED}✗${NC} $1 (MANQUANT)"
        ERRORS=$((ERRORS+1))
    fi
}

# Fonction pour vérifier les répertoires
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
    else
        echo -e "${RED}✗${NC} $1/ (MANQUANT)"
        ERRORS=$((ERRORS+1))
    fi
}

echo "📁 VÉRIFICATION DES RÉPERTOIRES"
echo "================================"
check_dir "src"
check_dir "src/components"
check_dir "src/styles"
check_dir "src/utils"
check_dir "contracts"
check_dir "migrations"
check_dir "build"
echo ""

echo "📄 VÉRIFICATION DES FICHIERS CLÉS"
echo "=================================="

# Smart Contract
check_file "contracts/EcommerceStore.sol"

# React Components
check_file "src/App.js"
check_file "src/components/Header.js"
check_file "src/components/ProductCard.js"
check_file "src/components/Cart.js"
check_file "src/components/Orders.js"
check_file "src/components/Dashboard.js"
check_file "src/components/SellerPanel.js"

# Styles
check_file "src/App.css"
check_file "src/index.css"
check_file "src/styles/Header.css"
check_file "src/styles/ProductCard.css"
check_file "src/styles/Cart.css"
check_file "src/styles/Orders.css"
check_file "src/styles/Dashboard.css"
check_file "src/styles/SellerPanel.css"

# Utils
check_file "src/utils/web3.js"
check_file "src/utils/helpers.js"
check_file "src/config.js"

# Migrations
check_file "migrations/2_deploy_contracts.js"

# Configuration
check_file "package.json"
check_file "truffle-config.js"

# Documentation
check_file "README.md"
check_file "GUIDE.md"
check_file "PROJECT_SUMMARY.md"
check_file "TROUBLESHOOTING.md"

echo ""

# Vérifier node_modules
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules/ (Dépendances installées)"
else
    echo -e "${YELLOW}⚠${NC} node_modules/ (Non installés - exécuter: npm install)"
    WARNINGS=$((WARNINGS+1))
fi

# Vérifier build
if [ -d "build/contracts" ]; then
    echo -e "${GREEN}✓${NC} build/contracts/ (Contrats compilés)"
else
    echo -e "${YELLOW}⚠${NC} build/contracts/ (Non compilés - exécuter: truffle compile)"
    WARNINGS=$((WARNINGS+1))
fi

echo ""
echo "📊 VÉRIFICATION DES DÉPENDANCES"
echo "================================"

# Vérifier package.json
if grep -q '"web3"' package.json; then
    echo -e "${GREEN}✓${NC} web3 en dépendance"
else
    echo -e "${RED}✗${NC} web3 manquant dans package.json"
    ERRORS=$((ERRORS+1))
fi

if grep -q '"react"' package.json; then
    echo -e "${GREEN}✓${NC} react en dépendance"
else
    echo -e "${RED}✗${NC} react manquant dans package.json"
    ERRORS=$((ERRORS+1))
fi

if grep -q '"truffle"' package.json; then
    echo -e "${GREEN}✓${NC} truffle en dépendance"
else
    echo -e "${YELLOW}⚠${NC} truffle peut être une dépendance globale"
    WARNINGS=$((WARNINGS+1))
fi

echo ""
echo "🔧 VÉRIFICATION DES OUTILS"
echo "=========================="

if command -v node &> /dev/null; then
    VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js ($VERSION)"
else
    echo -e "${RED}✗${NC} Node.js n'est pas installé"
    ERRORS=$((ERRORS+1))
fi

if command -v npm &> /dev/null; then
    VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} npm ($VERSION)"
else
    echo -e "${RED}✗${NC} npm n'est pas installé"
    ERRORS=$((ERRORS+1))
fi

if command -v truffle &> /dev/null; then
    echo -e "${GREEN}✓${NC} Truffle CLI (installé globalement)"
else
    echo -e "${YELLOW}⚠${NC} Truffle CLI (non trouvé - installer: npm install -g truffle)"
    WARNINGS=$((WARNINGS+1))
fi

if command -v ganache-cli &> /dev/null; then
    echo -e "${GREEN}✓${NC} Ganache CLI (installé globalement)"
else
    echo -e "${YELLOW}⚠${NC} Ganache CLI (non trouvé - installer: npm install -g ganache-cli)"
    WARNINGS=$((WARNINGS+1))
fi

echo ""
echo "======================================"
echo "RÉSUMÉ"
echo "======================================"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ TOUT EST PRÊT! 🚀${NC}"
    echo ""
    echo "Vous pouvez maintenant:"
    echo "1. Démarrer Ganache: ganache-cli --port 8545 --networkId 5777"
    echo "2. Compiler: truffle compile"
    echo "3. Déployer: truffle migrate --reset"
    echo "4. Lancer: npm start"
    echo ""
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNINGS AVERTISSEMENT(S)${NC}"
    echo "Le projet devrait fonctionner mais certains outils sont manquants"
else
    echo -e "${RED}❌ $ERRORS ERREUR(S)${NC}"
    echo "Veuillez corriger les erreurs avant de continuer"
fi

echo ""
exit $ERRORS
