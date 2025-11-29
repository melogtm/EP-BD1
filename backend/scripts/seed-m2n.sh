#!/bin/bash
# ============================================================================
# SCRIPT SEED M:N - Tabelas de Relacionamento
# ============================================================================

BASE_URL="http://localhost:3000"
SUCCESS=0
FAILED=0

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_ok() { echo -e "${GREEN}✓${NC} $1"; ((SUCCESS++)); }
log_err() { echo -e "${RED}✗${NC} $1"; ((FAILED++)); }

echo "=========================================="
echo "🚀 SEED PARTE 2: Tabelas M:N"
echo "=========================================="

# =============================================================================
# 23. PACIENTE_POSSUI_PLANO (25)
# =============================================================================
echo ""
echo "2️⃣3️⃣ Criando 25 Vínculos Paciente-Plano..."
for i in $(seq 1 25); do
  CPF_PAC="1$(printf "%08d" $((43+((i-1)%25)+1)))"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/paciente-possuiplano" \
    -H "Content-Type: application/json" \
    -d "{\"cpfPaciente\":\"$CPF_PAC\",\"planoId\":$((((i-1)%25)+1)),\"numeroCarteirinha\":\"CARTEIRA$(printf "%04d" $i)\"}")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  [[ $HTTP_CODE =~ ^2[0-9][0-9]$ ]] && log_ok "PacientePossuiPlano $i" || log_err "PacientePossuiPlano $i - HTTP $HTTP_CODE"
done

# =============================================================================
# 24. REALIZA_PLANTAO (25)
# =============================================================================
echo ""
echo "2️⃣4️⃣ Criando 25 Vínculos Realiza Plantão..."
for i in $(seq 1 25); do
  CPF_MED="1$(printf "%08d" $((32+((i-1)%11)+1)))"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/realiza-plantao" \
    -H "Content-Type: application/json" \
    -d "{\"cpfFuncSaude\":\"$CPF_MED\",\"plantaoId\":$((((i-1)%25)+1))}")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  [[ $HTTP_CODE =~ ^2[0-9][0-9]$ ]] && log_ok "RealizaPlantao $i" || log_err "RealizaPlantao $i - HTTP $HTTP_CODE"
done

# =============================================================================
# 25. ALTERA_PRODUTO (25)
# =============================================================================
echo ""
echo "2️⃣5️⃣ Criando 25 Alterações de Produto..."
for i in $(seq 1 25); do
  CPF_FUNC="1$(printf "%08d" $((i%25+1)))"
  DAYS=("2025-11-29" "2025-11-30" "2025-12-01" "2025-12-02" "2025-12-03" "2025-12-04" "2025-12-05")
  I_DIA=$(( (i-1) % 7 ))
  DIA=${DAYS[$I_DIA]}
  DTH="$DIA"T"10:00:00Z"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/altera-produto" \
    -H "Content-Type: application/json" \
    -d "{\"cpfFuncionario\":\"$CPF_FUNC\",\"prodId\":$((((i-1)%25)+1)),\"dataHoraModificacao\":\"$DTH\"}")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  [[ $HTTP_CODE =~ ^2[0-9][0-9]$ ]] && log_ok "AlteraProduto $i" || log_err "AlteraProduto $i - HTTP $HTTP_CODE"
done

# =============================================================================
# 26. CONSULTA_DIAGNOSTICO (25)
# =============================================================================
echo ""
echo "2️⃣6️⃣ Criando 25 Diagnósticos em Consulta..."
for i in $(seq 1 25); do
  DAYS=("2025-11-29" "2025-11-30" "2025-12-01" "2025-12-02" "2025-12-03" "2025-12-04" "2025-12-05")
  I_DIA=$(( (i-1) % 7 ))
  DIA=${DAYS[$I_DIA]}
  HORA=$((9 + ((i-1) % 8)))
  DTH="$DIA"T$(printf "%02d:00:00Z" $HORA)
  CID=$(printf "A%02d" $((i%25+1)))
  CPF_MED="1$(printf "%08d" $((32+((i-1)%11)+1)))"
  CPF_PAC="1$(printf "%08d" $((43+((i-1)%25)+1)))"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/consulta-diagnostico" \
    -H "Content-Type: application/json" \
    -d "{\"cid\":\"$CID\",\"dataHoraCons\":\"$DTH\",\"cpfPaciente\":\"$CPF_PAC\",\"cpfFuncSaude\":\"$CPF_MED\"}")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  [[ $HTTP_CODE =~ ^2[0-9][0-9]$ ]] && log_ok "ConsultaDiagnostico $i" || log_err "ConsultaDiagnostico $i - HTTP $HTTP_CODE"
done

echo ""
echo "=========================================="
echo -e "${GREEN}✓ Sucesso: $SUCCESS${NC} | ${RED}✗ Falhas: $FAILED${NC}"
echo "=========================================="
echo "✅ SEED M:N COMPLETO! (4 tabelas M:N = 100+ registros)"
echo "=========================================="
