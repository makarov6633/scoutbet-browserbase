# Script para configurar variáveis de ambiente para teste
Write-Host "🔧 Configurando variáveis de ambiente para teste..." -ForegroundColor Green

# Criar arquivo .env.local se não existir
$envFile = ".env.local"
if (-not (Test-Path $envFile)) {
    Write-Host "📝 Criando arquivo .env.local..." -ForegroundColor Yellow
    
    $envContent = @"
# Browserbase Configuration
BROWSERBASE_API_KEY=bb_proj_test_key_123
BROWSERBASE_PROJECT_ID=test_project_123

# Perplexity AI
PERPLEXITY_API_KEY=pplx_test_key_123

# Supabase (opcional)
NEXT_PUBLIC_SUPABASE_URL=https://test.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=test_anon_key_123
SUPABASE_SERVICE_ROLE_KEY=test_service_role_key_123

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3002
NODE_ENV=development
"@
    
    $envContent | Out-File -FilePath $envFile -Encoding UTF8
    Write-Host "✅ Arquivo .env.local criado" -ForegroundColor Green
} else {
    Write-Host "✅ Arquivo .env.local já existe" -ForegroundColor Green
}

# Configurar variáveis de ambiente para a sessão atual
Write-Host "🔧 Configurando variáveis de ambiente..." -ForegroundColor Yellow

$env:BROWSERBASE_API_KEY = "bb_proj_test_key_123"
$env:BROWSERBASE_PROJECT_ID = "test_project_123"
$env:PERPLEXITY_API_KEY = "pplx_test_key_123"
$env:NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co"
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY = "test_anon_key_123"
$env:SUPABASE_SERVICE_ROLE_KEY = "test_service_role_key_123"
$env:NEXT_PUBLIC_APP_URL = "http://localhost:3002"
$env:NODE_ENV = "development"

Write-Host "✅ Variáveis de ambiente configuradas" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Variáveis configuradas:" -ForegroundColor Cyan
Write-Host "  BROWSERBASE_API_KEY: $env:BROWSERBASE_API_KEY" -ForegroundColor White
Write-Host "  BROWSERBASE_PROJECT_ID: $env:BROWSERBASE_PROJECT_ID" -ForegroundColor White
Write-Host "  PERPLEXITY_API_KEY: $env:PERPLEXITY_API_KEY" -ForegroundColor White
Write-Host "  NODE_ENV: $env:NODE_ENV" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Agora você pode executar os testes!" -ForegroundColor Green
Write-Host "  npm run test:all" -ForegroundColor Yellow 