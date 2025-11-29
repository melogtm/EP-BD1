#!/bin/bash
# Script COMPLETO para popular 25 registros para CADA uma das 26 entidades + todas as M:N do modelo
# Entidades: Empresa, Pessoa, LocalSala, Paciente, Funcionario, FuncionarioAdm, FuncionarioSaude, PrestTerceirizado,
# Diagnostico, Medicamento, OperadoraPlanoSaude, PlanoDeSaude, Prontuario, Produto, Plantao, Consulta,
# Receita, Exame, Pagamento, TelefonePessoa, TelefoneEmpresa, ItemReceita, PacientePossuiPlano,
# RealizaPlantao, AlteraProduto, ConsultaDiagnostico
# Total esperado: 26 tabelas x 25 = 650+ chamadas de criação

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
echo "🚀 SEED COMPLETO: 25 registros x 26 entidades + M:N"
echo "=========================================="

# =============================================================================
# 1. EMPRESA (25)
# =============================================================================
echo ""
echo "1️⃣  Criando 25 Empresas..."
for i in $(seq 1 25); do
  CNPJ=$(printf "1234567800%04d" $i)
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/empresas" \
    -H "Content-Type: application/json" \
    -d "{\"cnpj\":\"$CNPJ\",\"razaoSocial\":\"Empresa $i Ltda\",\"endRua\":\"Rua $i\",\"endNum\":\"$i\",\"endBairro\":\"Bairro $i\",\"endCidade\":\"São Paulo\",\"endUf\":\"SP\",\"endPais\":\"Brasil\",\"endCep\":\"0100$(printf "%04d" $i)\",\"endComplem\":\"Prédio $i\"}")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  [[ $HTTP_CODE =~ ^2[0-9][0-9]$ ]] && log_ok "Empresa $i" || log_err "Empresa $i - HTTP $HTTP_CODE"
done

# =============================================================================
# 2. LOCAL_SALA (25)
# =============================================================================
echo ""
echo "2️⃣  Criando 25 Salas..."
ROOM_TYPES=("Consultório" "Laboratório" "Farmácia" "Administrativo" "Enfermaria" "Centro Cirúrgico" "Prontuário" "Recepção" "Armazém" "Arquivo" "Observação" "Ambulatório" "UTI" "Emergência" "Espera" "Diretoria" "Arquivo" "Farmácia2" "Consultório2" "Lab2" "Escritório" "Almoxarifado" "Depósito" "Sala Espera" "Sala Reunião")
for i in $(seq 1 25); do
  ROOM_NUM=$((500+i))
  ROOM_TYPE=${ROOM_TYPES[$((i-1))]}
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/salas" \
    -H "Content-Type: application/json" \
    -d "{\"numeroSala\":$ROOM_NUM,\"tipoSala\":\"$ROOM_TYPE\"}")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  [[ $HTTP_CODE =~ ^2[0-9][0-9]$ ]] && log_ok "Sala $ROOM_NUM" || log_err "Sala $ROOM_NUM - HTTP $HTTP_CODE"
done

# =============================================================================
# 3. PESSOA (88 = 25 func + 7 adm + 11 saúde + 25 pac + 20 terceirizados)
# =============================================================================
echo ""
echo "3️⃣  Criando 88 Pessoas..."
for i in $(seq 1 88); do
  G=$([ $((i % 2)) == 0 ] && echo "M" || echo "F")
  CPF="1$(printf "%08d" $i)"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/pessoas" \
    -H "Content-Type: application/json" \
    -d "{\"cpf\":\"$CPF\",\"nome\":\"Pessoa $i\",\"email\":\"p$i@email.com\",\"genero\":\"$G\",\"dataNascDia\":$((1+i%28)),\"dataNascMes\":$((1+i%12)),\"dataNascAno\":$((1970+i%40)),\"endRua\":\"Rua $i\",\"endNum\":\"$i\",\"endBairro\":\"Bairro\",\"endCidade\":\"São Paulo\",\"endUf\":\"SP\",\"endPais\":\"Brasil\",\"endCep\":\"0100$(printf "%04d" $i)\"}")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  [[ $HTTP_CODE =~ ^2[0-9][0-9]$ ]] && log_ok "Pessoa $i" || log_err "Pessoa $i - HTTP $HTTP_CODE"
done

# =============================================================================
# 4. FUNCIONÁRIO (25)
# =============================================================================
echo ""
echo "4️⃣  Criando 25 Funcionários..."
for i in $(seq 1 25); do
  CPF="1$(printf "%08d" $i)"
  SALA=$((500+((i-1)%25)+1))
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/funcionarios" \
    -H "Content-Type: application/json" \
    -d "{\"cpf\":\"$CPF\",\"dataAdmissao\":\"2020-01-$(printf "%02d" $((i%28+1)))\",\"salarioBase\":\"$((3000+i*100)).00\",\"statusCargo\":\"Ativo\",\"horarioTrab\":\"08:00-17:00\",\"salaAlocacao\":$SALA}")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  [[ $HTTP_CODE =~ ^2[0-9][0-9]$ ]] && log_ok "Funcionário $i" || log_err "Funcionário $i - HTTP $HTTP_CODE"
done

# =============================================================================
# 5. FUNCIONÁRIO_ADM (7) - CPFs 26-32
# =============================================================================
echo ""
echo "5️⃣  Criando 7 Funcionários Administrativos..."
for i in $(seq 1 7); do
  CPF="1$(printf "%08d" $((25+i)))"
  # Criar pessoa primeiro
  curl -s -X POST "$BASE_URL/pessoas" \
    -H "Content-Type: application/json" \
    -d "{\"cpf\":\"$CPF\",\"nome\":\"Admin $i\",\"email\":\"adm$i@email.com\",\"genero\":\"M\",\"dataNascDia\":$((1+i)),\"dataNascMes\":1,\"dataNascAno\":1985,\"endRua\":\"Rua Admin\",\"endNum\":\"$i\",\"endBairro\":\"Adm\",\"endCidade\":\"São Paulo\",\"endUf\":\"SP\",\"endPais\":\"Brasil\",\"endCep\":\"01000-000\"}" > /dev/null
  # Criar funcionário
  curl -s -X POST "$BASE_URL/funcionarios" \
    -H "Content-Type: application/json" \
    -d "{\"cpf\":\"$CPF\",\"dataAdmissao\":\"2020-01-01\",\"salarioBase\":\"3500.00\",\"statusCargo\":\"Ativo\",\"horarioTrab\":\"08:00-17:00\",\"salaAlocacao\":501}" > /dev/null
  # Criar funcionário ADM
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/funcionarios-adm" \
    -H "Content-Type: application/json" \
    -d "{\"cpf\":\"$CPF\"}")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  [[ $HTTP_CODE =~ ^2[0-9][0-9]$ ]] && log_ok "FuncionarioAdm $i" || log_err "FuncionarioAdm $i - HTTP $HTTP_CODE"
done

# =============================================================================
# 6. FUNCIONÁRIO_SAUDE (11) - CPFs 33-43
# =============================================================================
echo ""
echo "6️⃣  Criando 11 Funcionários de Saúde..."
SPECS=("Cardiologia" "Clínica Geral" "Pediatria" "Ortopedia" "Neurologia" "Dermatologia" "Otorrino" "Nefrologia" "Oncologia" "Gastro" "Urologia")
for i in $(seq 1 11); do
  CPF="1$(printf "%08d" $((32+i)))"
  # Criar pessoa
  curl -s -X POST "$BASE_URL/pessoas" \
    -H "Content-Type: application/json" \
    -d "{\"cpf\":\"$CPF\",\"nome\":\"Dr(a) $i\",\"email\":\"med$i@email.com\",\"genero\":\"M\",\"dataNascDia\":$((1+i)),\"dataNascMes\":6,\"dataNascAno\":1980,\"endRua\":\"Av Medical\",\"endNum\":\"$i\",\"endBairro\":\"Medical\",\"endCidade\":\"São Paulo\",\"endUf\":\"SP\",\"endPais\":\"Brasil\",\"endCep\":\"01400-000\"}" > /dev/null
  # Criar funcionário
  SALA=$((500+((i-1)%25)+1))
  curl -s -X POST "$BASE_URL/funcionarios" \
    -H "Content-Type: application/json" \
    -d "{\"cpf\":\"$CPF\",\"dataAdmissao\":\"2019-01-01\",\"salarioBase\":\"6500.00\",\"statusCargo\":\"Ativo\",\"horarioTrab\":\"08:00-18:00\",\"salaAlocacao\":$SALA}" > /dev/null
  # Criar funcionário de saúde
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/funcionarios-saude" \
    -H "Content-Type: application/json" \
    -d "{\"cpf\":\"$CPF\",\"registroProfissional\":\"CRM$(printf "%06d" $i)\",\"funcao\":\"Médico(a)\",\"especialidade\":\"${SPECS[$((i-1))]}\"}")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  [[ $HTTP_CODE =~ ^2[0-9][0-9]$ ]] && log_ok "FuncionarioSaude $i" || log_err "FuncionarioSaude $i - HTTP $HTTP_CODE"
done

# =============================================================================
# 7. PACIENTE (25)
# =============================================================================
echo ""
echo "7️⃣  Criando 25 Pacientes..."
BLOOD=("O+" "O-" "A+" "A-" "B+" "B-" "AB+" "AB-")
PROF=("Engenheiro" "Médico" "Advogado" "Professor" "Dentista" "Farmacêutico" "Contador" "Administrador")
for i in $(seq 1 25); do
  CPF="1$(printf "%08d" $((43+i)))"
  # Criar pessoa
  curl -s -X POST "$BASE_URL/pessoas" \
    -H "Content-Type: application/json" \
    -d "{\"cpf\":\"$CPF\",\"nome\":\"Paciente $i\",\"email\":\"pac$i@email.com\",\"genero\":\"M\",\"dataNascDia\":$((1+i%28)),\"dataNascMes\":$((1+i%12)),\"dataNascAno\":$((1950+i%40)),\"endRua\":\"Rua Pac $i\",\"endNum\":\"$i\",\"endBairro\":\"Pac\",\"endCidade\":\"São Paulo\",\"endUf\":\"SP\",\"endPais\":\"Brasil\",\"endCep\":\"0100$(printf "%04d" $i)\"}" > /dev/null
  # Criar paciente
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/pacientes" \
    -H "Content-Type: application/json" \
    -d "{\"cpf\":\"$CPF\",\"tipoSanguineo\":\"${BLOOD[$((i%8))]}\",\"profissao\":\"${PROF[$((i%8))]}\",\"statusCadastro\":\"Ativo\"}")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  [[ $HTTP_CODE =~ ^2[0-9][0-9]$ ]] && log_ok "Paciente $i" || log_err "Paciente $i - HTTP $HTTP_CODE"
done

# =============================================================================
# 8. PREST_TERCEIRIZADO (20) - CPFs 69-88
# =============================================================================
echo ""
echo "8️⃣  Criando 20 Prestadores Terceirizados..."
for i in $(seq 1 20); do
  CPF="1$(printf "%08d" $((68+i)))"
  # Pessoa já criada (CPFs 69-88)
  CNPJ=$(printf "1234567800%04d" $((i%25+1)))
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/prestadores" \
    -H "Content-Type: application/json" \
    -d "{\"cpf\":\"$CPF\",\"funcao\":\"Técnico $i\",\"cnpjEmpresa\":\"$CNPJ\"}")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  [[ $HTTP_CODE =~ ^2[0-9][0-9]$ ]] && log_ok "PrestTerceirizado $i" || log_err "PrestTerceirizado $i - HTTP $HTTP_CODE"
done

# =============================================================================
# 9. DIAGNÓSTICO (25)
# =============================================================================
echo ""
echo "9️⃣  Criando 25 Diagnósticos..."
for i in $(seq 1 25); do
  CID=$(printf "A%02d" $i)
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/diagnosticos" \
    -H "Content-Type: application/json" \
    -d "{\"cid\":\"$CID\",\"descricao\":\"Diagnóstico $i\"}")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  [[ $HTTP_CODE =~ ^2[0-9][0-9]$ ]] && log_ok "Diagnostico $CID" || log_err "Diagnostico $CID - HTTP $HTTP_CODE"
done

# =============================================================================
# 10. MEDICAMENTO (25)
# =============================================================================
echo ""
echo "🔟 Criando 25 Medicamentos..."
for i in $(seq 1 25); do
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/medicamentos" \
    -H "Content-Type: application/json" \
    -d "{\"nome\":\"Medicamento $(printf "%02d" $i)\"}")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  [[ $HTTP_CODE =~ ^2[0-9][0-9]$ ]] && log_ok "Medicamento $i" || log_err "Medicamento $i - HTTP $HTTP_CODE"
done

# =============================================================================
# 11. OPERADORA_PLANO_DE_SAUDE (10)
# =============================================================================
echo ""
echo "1️⃣1️⃣ Criando 10 Operadoras de Plano de Saúde..."
for i in $(seq 1 10); do
  CNPJ=$(printf "1234567800%04d" $i)
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/operadoras" \
    -H "Content-Type: application/json" \
    -d "{\"cnpj\":\"$CNPJ\"}")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  [[ $HTTP_CODE =~ ^2[0-9][0-9]$ ]] && log_ok "Operadora $i" || log_err "Operadora $i - HTTP $HTTP_CODE"
done

# =============================================================================
# 12. PLANO_DE_SAUDE (25)
# =============================================================================
echo ""
echo "1️⃣2️⃣ Criando 25 Planos de Saúde..."
MODALS=("Coparticipativo" "Livre" "Rede" "Franquia" "Reembolso" "Ambulatorial" "Hospitalar" "Referência" "Básico" "Flexible" "Top" "Familia" "Premium" "Empresarial" "Estudantil" "Popular" "Executivo" "Odonto" "Integral" "Expansivo" "Multiprofissional" "Completo" "Essencial" "Regional" "Internacional")
for i in $(seq 1 25); do
  CNPJ=$(printf "1234567800%04d" $(((i-1)%10+1)))
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/planos" \
    -H "Content-Type: application/json" \
    -d "{\"nomePlano\":\"Plano ${MODALS[$((i-1))]}\",\"modalidade\":\"${MODALS[$((i-1))]}\",\"cnpjOperadora\":\"$CNPJ\"}")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  [[ $HTTP_CODE =~ ^2[0-9][0-9]$ ]] && log_ok "PlanoDeSaude $i" || log_err "PlanoDeSaude $i - HTTP $HTTP_CODE"
done

# =============================================================================
# 13. PRODUTO (25)
# =============================================================================
echo ""
echo "1️⃣3️⃣ Criando 25 Produtos..."
for i in $(seq 1 25); do
  CPF_ADM="1$(printf "%08d" $((25+((i-1)%7)+1)))"
  CNPJ_FORN=$(printf "1234567800%04d" $((i%25+1)))
  SALA=$((500+((i-1)%25)+1))
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/produtos" \
    -H "Content-Type: application/json" \
    -d "{\"descricao\":\"Produto $i\",\"validade\":\"2027-06-$(printf "%02d" $((i%28+1)))\",\"fabricante\":\"Fabricante $(((i-1)%5+1))\",\"cpfCadastrou\":\"$CPF_ADM\",\"cnpjFornecedor\":\"$CNPJ_FORN\",\"sala\":$SALA}")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  [[ $HTTP_CODE =~ ^2[0-9][0-9]$ ]] && log_ok "Produto $i" || log_err "Produto $i - HTTP $HTTP_CODE"
done

# =============================================================================
# 14. PLANTÃO (25)
# =============================================================================
echo ""
echo "1️⃣4️⃣ Criando 25 Plantões..."
for i in $(seq 1 25); do
  DAY=$((1+i%28))
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/plantoes" \
    -H "Content-Type: application/json" \
    -d "{\"dataHoraInicio\":\"2025-11-$(printf "%02d" $DAY)T08:00:00Z\",\"dataHoraFim\":\"2025-11-$(printf "%02d" $DAY)T16:00:00Z\"}")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  [[ $HTTP_CODE =~ ^2[0-9][0-9]$ ]] && log_ok "Plantao $i" || log_err "Plantao $i - HTTP $HTTP_CODE"
done

# =============================================================================
# 15. CONSULTA (70) - dias 29 nov a 5 dez, várias especialidades simuladas
# =============================================================================
echo ""
echo "1️⃣5️⃣ Criando 70 Consultas em múltiplos dias para simular agenda real..."
DAYS=("2025-11-29" "2025-11-30" "2025-12-01" "2025-12-02" "2025-12-03" "2025-12-04" "2025-12-05")
STATUS=("Realizado" "Agendada" "Cancelado" "Realizado" "Agendada" "Agendada" "Cancelado")
TIPOS=("Presencial" "Remoto" "Presencial" "Remoto" "Presencial" "Presencial" "Remoto")
for i in $(seq 1 70); do
  I_DIA=$(( (i-1) % 7 ))
  DIA=${DAYS[$I_DIA]}
  HORA=$((9 + (i % 8)))
  HORA_FORMAT=$(printf "%02d:00:00Z" $HORA)
  DTH="$DIA"T"$HORA_FORMAT"

  SALA=$((500 + ((i-1) % 25) + 1))
  
  CPF_MED="1$(printf "%08d" $((32 + ((i-1) % 11) + 1)))"
  CPF_PAC="1$(printf "%08d" $((43 + ((i-1) % 25) + 1)))"

  # Define observaçoesClinicas com a especialidade do médico mockada via CPF % lista
  docs=("Cardiologia" "Clínica Geral" "Pediatria" "Ortopedia" "Neurologia" "Dermatologia" "Otorrino" "Nefrologia" "Oncologia" "Gastro" "Urologia")
  ESPECIALIDADE=${docs[$(( (i-1) % 11 ))]}

  VALOR=$((150 + (i % 100)))

  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/consultas" \
    -H "Content-Type: application/json" \
    -d "{
      \"dataHoraAgendada\": \"$DTH\",
      \"cpfFuncSaude\": \"$CPF_MED\",
      \"cpfPaciente\": \"$CPF_PAC\",
      \"sala\": $SALA,
      \"dataHoraInicio\": \"$DTH\",
      \"dataHoraFim\": \"$DIA"T"$(printf "%02d:00:00Z" $((HORA+1)))\",
      \"valorAtendimento\": \"$VALOR\",
      \"observacoesClinicas\": \"Consulta em $ESPECIALIDADE\",
      \"tipoAtendimento\": \"${TIPOS[$I_DIA]}\",
      \"statusAtendimento\": \"${STATUS[$I_DIA]}\"
    }")

  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  [[ $HTTP_CODE =~ ^2[0-9][0-9]$ ]] && log_ok "Consulta $i ($DIA $HORA:00 - $ESPECIALIDADE)" || log_err "Consulta $i HTTP $HTTP_CODE"
done

# =============================================================================
# 16. RECEITA (25)
# =============================================================================
echo ""
echo "1️⃣6️⃣ Criando 25 Receitas..."
for i in $(seq 1 25); do
  DAY=$((1+i%28))
  DTH="2025-11-$(printf "%02d" $DAY)T09:00:00Z"
  CPF_MED="1$(printf "%08d" $((32+((i-1)%11)+1)))"
  CPF_PAC="1$(printf "%08d" $((43+((i-1)%25)+1)))"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/receitas" \
    -H "Content-Type: application/json" \
    -d "{\"validade\":\"2025-12-$(printf "%02d" $DAY)\",\"dataEmissao\":\"2025-11-$(printf "%02d" $DAY)\",\"observacoes\":\"Receita $i\",\"dataHoraCons\":\"$DTH\",\"cpfPaciente\":\"$CPF_PAC\",\"cpfFuncSaude\":\"$CPF_MED\"}")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  [[ $HTTP_CODE =~ ^2[0-9][0-9]$ ]] && log_ok "Receita $i" || log_err "Receita $i - HTTP $HTTP_CODE"
done

# =============================================================================
# 17. EXAME (25)
# =============================================================================
echo ""
echo "1️⃣7️⃣ Criando 25 Exames..."
EXAM_TYPES=("Radiografia" "Hemograma" "Tomografia" "Ultrassom" "Endoscopia" "Colonoscopia" "ECG" "EEG" "Urinálise" "Bioquímica" "Glicemia" "Coagulograma" "Parasitológico" "Hemocultura" "Hormonais" "PCR" "Gasometria" "Plaquetas" "Soro" "Vitamina D" "TSH" "Hemoglobina" "Dengue NS1" "Sangue Oculto" "COVID PCR")
for i in $(seq 1 25); do
  DAY=$((1+i%28))
  DTH="2025-11-$(printf "%02d" $DAY)T09:00:00Z"
  SALA=$((500+((i-1)%25)+1))
  CPF_MED="1$(printf "%08d" $((32+((i-1)%11)+1)))"
  CPF_PAC="1$(printf "%08d" $((43+((i-1)%25)+1)))"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/exames" \
    -H "Content-Type: application/json" \
    -d "{\"tipoExame\":\"${EXAM_TYPES[$((i-1))]}\",\"descricao\":\"Exame $i\",\"dataHoraSolicitacao\":\"$DTH\",\"dataHoraRealizacao\":\"2025-11-$(printf "%02d" $DAY)T15:00:00Z\",\"resultado\":\"Normal\",\"observacoes\":\"Observação $i\",\"dataHoraCons\":\"$DTH\",\"cpfPaciente\":\"$CPF_PAC\",\"cpfFuncSaude\":\"$CPF_MED\",\"sala\":$SALA}")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  [[ $HTTP_CODE =~ ^2[0-9][0-9]$ ]] && log_ok "Exame $i" || log_err "Exame $i - HTTP $HTTP_CODE"
done

# =============================================================================
# 18. PAGAMENTO (25)
# =============================================================================
echo ""
echo "1️⃣8️⃣ Criando 25 Pagamentos (consulta)..."
STATUS_PAG=("Pago" "Pendente" "Atrasado" "Cancelado" "Rejeitado" "Em Análise" "Aguardando" "Reembolsado")
for i in $(seq 1 25); do
  DAY=$((1+i%28))
  DTH="2025-11-$(printf "%02d" $DAY)T09:00:00Z"
  CPF_MED="1$(printf "%08d" $((32+((i-1)%11)+1)))"
  CPF_PAC="1$(printf "%08d" $((43+((i-1)%25)+1)))"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/pagamentos" \
    -H "Content-Type: application/json" \
    -d "{\"valor\":\"$((160+i)).00\",\"dataPag\":\"2025-11-$(printf "%02d" $DAY)\",\"statusPagamento\":\"${STATUS_PAG[$((i%8))]}\",\"dataHoraCons\":\"$DTH\",\"cpfPaciente\":\"$CPF_PAC\",\"cpfFuncSaude\":\"$CPF_MED\"}")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  [[ $HTTP_CODE =~ ^2[0-9][0-9]$ ]] && log_ok "Pagamento $i" || log_err "Pagamento $i - HTTP $HTTP_CODE"
done

# =============================================================================
# 19. PRONTUÁRIO (25)
# =============================================================================
echo ""
echo "1️⃣9️⃣ Criando 25 Prontuários..."
for i in $(seq 1 25); do
  DAY=$((1+i%28))
  CPF_PAC="1$(printf "%08d" $((43+((i-1)%25)+1)))"
  CPF_MED="1$(printf "%08d" $((32+((i-1)%11)+1)))"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/prontuarios" \
    -H "Content-Type: application/json" \
    -d "{\"cpfPaciente\":\"$CPF_PAC\",\"dataHoraCriacao\":\"2025-11-$(printf "%02d" $DAY)T14:00:00Z\",\"cpfAtualizou\":\"$CPF_MED\",\"dataHoraAtualizacao\":\"2025-11-$(printf "%02d" $DAY)T14:00:00Z\"}")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  [[ $HTTP_CODE =~ ^2[0-9][0-9]$ ]] && log_ok "Prontuario $i" || log_err "Prontuario $i - HTTP $HTTP_CODE"
done

# =============================================================================
# 20. TELEFONE_PESSOA (25)
# =============================================================================
echo ""
echo "2️⃣0️⃣ Criando 25 Telefones Pessoa..."
for i in $(seq 1 25); do
  CPF="1$(printf "%08d" $((43+((i-1)%25)+1)))"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/telefones-pessoa" \
    -H "Content-Type: application/json" \
    -d "{\"cpf\":\"$CPF\",\"codPais\":\"55\",\"ddd\":\"11\",\"telefone\":\"9$(printf "%04d" $((9000+i)))-$(printf "%04d" $((1000+i)))\"}")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  [[ $HTTP_CODE =~ ^2[0-9][0-9]$ ]] && log_ok "TelefonePessoa $i" || log_err "TelefonePessoa $i - HTTP $HTTP_CODE"
done

# =============================================================================
# 21. TELEFONE_EMPRESA (25)
# =============================================================================
echo ""
echo "2️⃣1️⃣ Criando 25 Telefones Empresa..."
for i in $(seq 1 25); do
  CNPJ=$(printf "1234567800%04d" $i)
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/telefones-empresa" \
    -H "Content-Type: application/json" \
    -d "{\"cnpj\":\"$CNPJ\",\"codPais\":\"55\",\"ddd\":\"11\",\"telefone\":\"3$(printf "%04d" $((2000+i)))-$(printf "%04d" $((5000+i)))\"}")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  [[ $HTTP_CODE =~ ^2[0-9][0-9]$ ]] && log_ok "TelefoneEmpresa $i" || log_err "TelefoneEmpresa $i - HTTP $HTTP_CODE"
done

# =============================================================================
# 22. ITEM_RECEITA (25)
# =============================================================================
echo ""
echo "2️⃣2️⃣ Criando 25 Itens de Receita..."
for i in $(seq 1 25); do
  MED="Medicamento $(printf "%02d" $((i%25+1)))"
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/item-receita" \
    -H "Content-Type: application/json" \
    -d "{\"receitaId\":$i,\"nomeMedicamentoGenerico\":\"$MED\",\"posologia\":\"Tomar 1 comprimido 2x ao dia\"}")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  [[ $HTTP_CODE =~ ^2[0-9][0-9]$ ]] && log_ok "ItemReceita $i" || log_err "ItemReceita $i - HTTP $HTTP_CODE"
done

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
  DAY=$((1+i%28))
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/altera-produto" \
    -H "Content-Type: application/json" \
    -d "{\"cpfFuncionario\":\"$CPF_FUNC\",\"prodId\":$((((i-1)%25)+1)),\"dataHoraModificacao\":\"2025-11-$(printf "%02d" $DAY)T10:00:00Z\"}")
  HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
  [[ $HTTP_CODE =~ ^2[0-9][0-9]$ ]] && log_ok "AlteraProduto $i" || log_err "AlteraProduto $i - HTTP $HTTP_CODE"
done

# =============================================================================
# 26. CONSULTA_DIAGNOSTICO (25)
# =============================================================================
echo ""
echo "2️⃣6️⃣ Criando 25 Diagnósticos em Consulta..."
for i in $(seq 1 25); do
  DAY=$((1+i%28))
  DTH="2025-11-$(printf "%02d" $DAY)T09:00:00Z"
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
echo "✅ Seed completo finalizado! (26 entidades x 25 = 650+ registros + M:N)"