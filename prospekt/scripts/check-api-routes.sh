#!/bin/bash

echo "=========================================="
echo "Vérification des Routes API - Prospekt"
echo "=========================================="
echo ""

if [ ! -f "package.json" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis la racine du projet"
    exit 1
fi

echo "✅ Répertoire du projet: $(pwd)"
echo ""

echo "📊 Nombre de routes API créées:"
route_count=$(find src/app/api -name "route.ts" 2>/dev/null | wc -l)
echo "   Total: $route_count routes"
echo ""

echo "📁 Routes API disponibles:"
find src/app/api -name "route.ts" 2>/dev/null | sort | while read file; do
    path=$(dirname "$file" | sed 's|src/app/api/||')
    echo "   ✓ /api/$path"
done
echo ""

echo "🔧 Fichiers de configuration:"
[ -f ".env.example" ] && echo "   ✓ .env.example existe" || echo "   ❌ .env.example manquant"
[ -f ".env" ] && echo "   ✓ .env existe" || echo "   ⚠️  .env manquant (à créer à partir de .env.example)"
[ -f "src/lib/supabase.ts" ] && echo "   ✓ Client Supabase configuré" || echo "   ❌ Client Supabase manquant"
echo ""

echo "📦 Dépendances requises:"
grep -q "@supabase/supabase-js" package.json && echo "   ✓ @supabase/supabase-js" || echo "   ❌ @supabase/supabase-js manquant"
grep -q "@anthropic-ai/sdk" package.json && echo "   ✓ @anthropic-ai/sdk" || echo "   ❌ @anthropic-ai/sdk manquant"
echo ""
[ -d "node_modules" ] && echo "   ✓ node_modules installés" || echo "   ⚠️  node_modules manquants (exécuter 'npm install')"
echo ""

echo "=========================================="
echo "Résumé:"
echo "=========================================="
echo "Routes API: $route_count/5 (objectif: ≤12 pour Vercel)"

if [ $route_count -le 12 ]; then
    echo "✅ Limite Vercel respectée!"
else
    echo "❌ Limite Vercel dépassée!"
fi
echo ""

echo "Pour démarrer le serveur de développement:"
echo "  npm run dev"
echo ""
