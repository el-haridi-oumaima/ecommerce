#!/bin/bash

# 🚀 Script de démarrage - Plateforme E-commerce Décentralisée
# Ce script automatise le démarrage complet de l'application

echo "======================================"
echo "🛍️  Plateforme E-commerce Décentralisée"
echo "======================================"
echo ""

# Vérifications préalables
echo "✓ Vérification des outils..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

if ! command -v truffle &> /dev/null; then
    echo "⚠️  Truffle n'est pas installé globalement"
    echo "Installation: npm install -g truffle"
fi

echo "✅ Tous les outils sont disponibles"
echo ""

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm install

echo ""
echo "✅ Installation complète"
echo ""

# Instructions suivantes
echo "======================================"
echo "📝 PROCHAINES ÉTAPES:"
echo "======================================"
echo ""
echo "1️⃣  TERMINAL 1 - Démarrer Ganache:"
echo "   ganache-cli --port 8545 --networkId 5777"
echo ""
echo "2️⃣  TERMINAL 2 - Compiler et déployer:"
echo "   npm run compile"
echo "   npm run migrate"
echo ""
echo "3️⃣  TERMINAL 3 - Lancer l'app:"
echo "   npm start"
echo ""
echo "4️⃣  Configurez MetaMask:"
echo "   - RPC URL: http://localhost:8545"
echo "   - Chain ID: 5777"
echo "   - Importez un compte Ganache"
echo ""
echo "5️⃣  Ouvrir http://localhost:3000 dans le navigateur"
echo ""
echo "======================================"
echo "✨ Bonne chance ! 🚀"
echo "======================================"
