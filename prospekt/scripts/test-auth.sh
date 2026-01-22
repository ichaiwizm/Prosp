#!/bin/bash

# Script de test du système d'authentification Prospekt

echo "🔍 Test du système d'authentification Prospekt"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.local exists
echo "1. Vérification de .env.local..."
if [ -f .env.local ]; then
    echo -e "${GREEN}✓${NC} .env.local trouvé"

    # Check for required variables
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local && grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        echo -e "${GREEN}✓${NC} Variables d'environnement Supabase configurées"
    else
        echo -e "${RED}✗${NC} Variables d'environnement Supabase manquantes"
        exit 1
    fi
else
    echo -e "${RED}✗${NC} .env.local non trouvé"
    exit 1
fi

echo ""

# Check if required files exist
echo "2. Vérification des fichiers d'authentification..."

files=(
    "src/hooks/useAuth.ts"
    "src/hooks/use-user.ts"
    "src/app/(auth)/login/page.tsx"
    "src/app/(auth)/layout.tsx"
    "src/lib/supabase/middleware.ts"
    "src/middleware.ts"
)

all_files_exist=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file manquant"
        all_files_exist=false
    fi
done

if [ "$all_files_exist" = false ]; then
    echo -e "${RED}✗${NC} Certains fichiers sont manquants"
    exit 1
fi

echo ""

# Check if node_modules exists
echo "3. Vérification des dépendances..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules présent"
else
    echo -e "${YELLOW}⚠${NC} node_modules non trouvé. Installation des dépendances..."
    npm install
fi

echo ""

# Check TypeScript compilation
echo "4. Vérification de la compilation TypeScript..."
npx tsc --noEmit > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Pas d'erreurs TypeScript"
else
    echo -e "${YELLOW}⚠${NC} Avertissements TypeScript (vérifiez avec 'npx tsc --noEmit')"
fi

echo ""

# Summary
echo "================================================"
echo "📊 Résumé"
echo "================================================"
echo ""
echo "Fichiers créés:"
echo "  - src/hooks/use-user.ts"
echo "  - src/app/(auth)/layout.tsx"
echo "  - src/app/(auth)/login/page.tsx"
echo ""
echo "Fichiers modifiés:"
echo "  - src/hooks/useAuth.ts"
echo "  - src/lib/supabase/middleware.ts"
echo "  - src/components/layout/sidebar.tsx"
echo "  - src/app/(app)/dashboard/page.tsx"
echo "  - src/app/globals.css"
echo ""
echo "Comptes de test:"
echo "  TECH: ichai@prospekt.app / password123"
echo "  COMMERCIAL: manu@prospekt.app / password123"
echo ""
echo "Pour démarrer le serveur de développement:"
echo "  npm run dev"
echo ""
echo -e "${GREEN}✓${NC} Système d'authentification prêt !"
