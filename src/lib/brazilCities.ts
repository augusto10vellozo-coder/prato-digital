/**
 * Cobertura de cidades do wizard de prospecção.
 *
 * O conjunto cobre as 27 capitais e as principais cidades de cada estado,
 * com DDD, coordenadas (para o mapa) e bairros usados nos resultados
 * ilustrativos. Não é uma base exaustiva: é uma amostra ampla o suficiente
 * para o parceiro trabalhar em qualquer região do país.
 */

export type Region = 'Norte' | 'Nordeste' | 'Centro-Oeste' | 'Sudeste' | 'Sul'

export interface City {
  name: string
  state: string
  region: Region
  ddd: string
  lat: number
  lng: number
  neighborhoods: string[]
}

export const REGIONS: Region[] = [
  'Norte',
  'Nordeste',
  'Centro-Oeste',
  'Sudeste',
  'Sul',
]

const REGION_BY_UF: Record<string, Region> = {
  AC: 'Norte',
  AM: 'Norte',
  AP: 'Norte',
  PA: 'Norte',
  RO: 'Norte',
  RR: 'Norte',
  TO: 'Norte',
  AL: 'Nordeste',
  BA: 'Nordeste',
  CE: 'Nordeste',
  MA: 'Nordeste',
  PB: 'Nordeste',
  PE: 'Nordeste',
  PI: 'Nordeste',
  RN: 'Nordeste',
  SE: 'Nordeste',
  DF: 'Centro-Oeste',
  GO: 'Centro-Oeste',
  MT: 'Centro-Oeste',
  MS: 'Centro-Oeste',
  ES: 'Sudeste',
  MG: 'Sudeste',
  RJ: 'Sudeste',
  SP: 'Sudeste',
  PR: 'Sul',
  RS: 'Sul',
  SC: 'Sul',
}

/** [nome, UF, DDD, latitude, longitude, ...bairros] */
type RawCity = [string, string, string, number, number, ...string[]]

const RAW_CITIES: RawCity[] = [
  /* ---------------- Norte ---------------- */
  ['Rio Branco', 'AC', '68', -9.9747, -67.8243, 'Centro', 'Bosque', 'Calafate', 'Jardim Europa'],
  ['Manaus', 'AM', '92', -3.119, -60.0217, 'Centro', 'Adrianópolis', 'Ponta Negra', 'Flores', 'Vieiralves'],
  ['Macapá', 'AP', '96', 0.0349, -51.0694, 'Centro', 'Jesus de Nazaré', 'Trem', 'Buritizal'],
  ['Belém', 'PA', '91', -1.4558, -48.4902, 'Batista Campos', 'Nazaré', 'Umarizal', 'Marco', 'Cidade Velha'],
  ['Ananindeua', 'PA', '91', -1.3656, -48.3722, 'Centro', 'Cidade Nova', 'Guanabara', 'Coqueiro'],
  ['Santarém', 'PA', '93', -2.4431, -54.7083, 'Centro', 'Aldeia', 'Livramento', 'Prainha'],
  ['Porto Velho', 'RO', '69', -8.7608, -63.8999, 'Centro', 'Flodoaldo Pontes Pinto', 'Nova Porto Velho', 'Embratel'],
  ['Ji-Paraná', 'RO', '69', -10.8777, -61.9322, 'Centro', 'Urupá', 'Nova Brasília', 'Jardim Aurélio Bernardi'],
  ['Boa Vista', 'RR', '95', 2.8235, -60.6758, 'Centro', 'Caçari', 'Mecejana', 'Paraviana'],
  ['Palmas', 'TO', '63', -10.2491, -48.3243, 'Plano Diretor Sul', 'Plano Diretor Norte', 'Taquaralto', 'Jardim Aureny'],
  ['Araguaína', 'TO', '63', -7.1911, -48.2072, 'Centro', 'Setor Oeste', 'Vila Norte', 'Jardim das Palmeiras'],

  /* ---------------- Nordeste ---------------- */
  ['São Luís', 'MA', '98', -2.5307, -44.3068, 'Renascença', 'Cohama', 'Ponta da Areia', 'Centro', 'Calhau'],
  ['Imperatriz', 'MA', '99', -5.5261, -47.4917, 'Centro', 'Nova Imperatriz', 'Bacuri', 'Jardim das Oliveiras'],
  ['Teresina', 'PI', '86', -5.0892, -42.8019, 'Centro', 'Jóquei', 'Fátima', 'Dirceu', 'Ilhotas'],
  ['Parnaíba', 'PI', '86', -2.905, -41.7767, 'Centro', 'Piauí', 'São José', 'Frei Higino'],
  ['Fortaleza', 'CE', '85', -3.7319, -38.5267, 'Aldeota', 'Meireles', 'Montese', 'Benfica', 'Varjota'],
  ['Caucaia', 'CE', '85', -3.7361, -38.6531, 'Centro', 'Icaraí', 'Jurema', 'Parque Albano'],
  ['Sobral', 'CE', '88', -3.688, -40.3497, 'Centro', 'Derby', 'Junco', 'Dom Expedito'],
  ['Natal', 'RN', '84', -5.7945, -35.211, 'Ponta Negra', 'Tirol', 'Alecrim', 'Petrópolis', 'Capim Macio'],
  ['Mossoró', 'RN', '84', -5.1875, -37.3442, 'Centro', 'Nova Betânia', 'Abolição', 'Alto de São Manoel'],
  ['João Pessoa', 'PB', '83', -7.1195, -34.845, 'Tambaú', 'Manaíra', 'Bessa', 'Centro', 'Bancários'],
  ['Campina Grande', 'PB', '83', -7.2307, -35.8815, 'Centro', 'Bodocongó', 'Catolé', 'Prata'],
  ['Recife', 'PE', '81', -8.0476, -34.877, 'Boa Viagem', 'Casa Forte', 'Derby', 'Espinheiro', 'Graças'],
  ['Olinda', 'PE', '81', -7.9997, -34.8456, 'Carmo', 'Casa Caiada', 'Bairro Novo', 'Jardim Atlântico'],
  ['Caruaru', 'PE', '81', -8.2828, -35.9728, 'Centro', 'Maurício de Nassau', 'Boa Vista', 'Indianópolis'],
  ['Jaboatão dos Guararapes', 'PE', '81', -8.1128, -35.0147, 'Piedade', 'Candeias', 'Prazeres', 'Cavaleiro'],
  ['Maceió', 'AL', '82', -9.6658, -35.7353, 'Ponta Verde', 'Jatiúca', 'Farol', 'Pajuçara', 'Gruta de Lourdes'],
  ['Arapiraca', 'AL', '82', -9.7525, -36.6611, 'Centro', 'Baixão', 'Primavera', 'Senador Arnon de Melo'],
  ['Aracaju', 'SE', '79', -10.9472, -37.0731, 'Jardins', 'Atalaia', 'Grageru', 'Centro', 'Farolândia'],
  ['Nossa Senhora do Socorro', 'SE', '79', -10.855, -37.1261, 'Centro', 'Taiçoca', 'Albano Franco', 'Piabeta'],
  ['Salvador', 'BA', '71', -12.9777, -38.5016, 'Barra', 'Pituba', 'Itaigara', 'Rio Vermelho', 'Ondina'],
  ['Feira de Santana', 'BA', '75', -12.2664, -38.9663, 'Centro', 'Kalilândia', 'Cidade Nova', 'Santa Mônica'],
  ['Vitória da Conquista', 'BA', '77', -14.8619, -40.8442, 'Centro', 'Candeias', 'Recreio', 'Brasil'],
  ['Camaçari', 'BA', '71', -12.6994, -38.3242, 'Centro', 'Catu de Abrantes', 'Gleba B', 'Parafuso'],
  ['Ilhéus', 'BA', '73', -14.793, -39.046, 'Centro', 'Pontal', 'Cidade Nova', 'Jardim Atlântico'],

  /* ---------------- Centro-Oeste ---------------- */
  ['Brasília', 'DF', '61', -15.7939, -47.8828, 'Asa Sul', 'Asa Norte', 'Águas Claras', 'Taguatinga', 'Sudoeste'],
  ['Goiânia', 'GO', '62', -16.6869, -49.2648, 'Setor Bueno', 'Setor Oeste', 'Campinas', 'Jardim Goiás', 'Setor Marista'],
  ['Aparecida de Goiânia', 'GO', '62', -16.8233, -49.2439, 'Centro', 'Setor Garavelo', 'Jardim Tropical', 'Cidade Livre'],
  ['Anápolis', 'GO', '62', -16.3286, -48.9531, 'Centro', 'Jundiaí', 'Vila Operária', 'Setor Sul'],
  ['Cuiabá', 'MT', '65', -15.6014, -56.0979, 'Centro', 'Goiabeiras', 'Jardim Cuiabá', 'Santa Rosa'],
  ['Várzea Grande', 'MT', '65', -15.6467, -56.1325, 'Centro', 'Cristo Rei', 'Jardim Glória', 'Ponta do Morro'],
  ['Campo Grande', 'MS', '67', -20.4697, -54.6201, 'Centro', 'Jardim dos Estados', 'Chácara Cachoeira', 'Nova Lima', 'Tiradentes'],
  ['Dourados', 'MS', '67', -22.2231, -54.812, 'Centro', 'Jardim Água Boa', 'Vila São Pedro', 'Jardim Climax'],

  /* ---------------- Sudeste ---------------- */
  ['Belo Horizonte', 'MG', '31', -19.9167, -43.9345, 'Savassi', 'Lourdes', 'Funcionários', 'Pampulha', 'Santo Agostinho'],
  ['Uberlândia', 'MG', '34', -18.9186, -48.2772, 'Centro', 'Santa Mônica', 'Tibery', 'Jardim Karaíba'],
  ['Contagem', 'MG', '31', -19.9317, -44.0536, 'Centro', 'Eldorado', 'Ressaca', 'Cidade Industrial'],
  ['Juiz de Fora', 'MG', '32', -21.7618, -43.3503, 'Centro', 'Cascatinha', 'São Mateus', 'Alto dos Passos'],
  ['Montes Claros', 'MG', '38', -16.7286, -43.8578, 'Centro', 'Ibituruna', 'Todos os Santos', 'Jardim São Luiz'],
  ['Vitória', 'ES', '27', -20.3155, -40.3128, 'Praia do Canto', 'Jardim da Penha', 'Centro', 'Mata da Praia'],
  ['Vila Velha', 'ES', '27', -20.3297, -40.2925, 'Praia da Costa', 'Itapoã', 'Centro', 'Coqueiral de Itaparica'],
  ['Serra', 'ES', '27', -20.121, -40.3075, 'Laranjeiras', 'Jacaraípe', 'Colina de Laranjeiras', 'Feu Rosa'],
  ['Cariacica', 'ES', '27', -20.2639, -40.4164, 'Campo Grande', 'Jardim América', 'Bela Vista', 'Porto de Santana'],
  ['Rio de Janeiro', 'RJ', '21', -22.9068, -43.1729, 'Ipanema', 'Botafogo', 'Tijuca', 'Barra da Tijuca', 'Centro'],
  ['Niterói', 'RJ', '21', -22.8833, -43.1036, 'Icaraí', 'Centro', 'Itaipu', 'Santa Rosa'],
  ['Nova Iguaçu', 'RJ', '21', -22.7595, -43.451, 'Centro', 'Posse', 'Vila de Cava', 'Califórnia'],
  ['Duque de Caxias', 'RJ', '21', -22.7856, -43.3117, 'Centro', 'Jardim Primavera', 'Saracuruna', 'Vila Leopoldina'],
  ['Campos dos Goytacazes', 'RJ', '22', -21.7545, -41.3244, 'Centro', 'Pelinca', 'Jardim Carioca', 'Goitacazes'],
  ['São Gonçalo', 'RJ', '21', -22.8268, -43.0539, 'Alcântara', 'Neves', 'Centro', 'Colubandê'],
  ['São Paulo', 'SP', '11', -23.5505, -46.6333, 'Pinheiros', 'Vila Madalena', 'Moema', 'Itaim Bibi', 'Tatuapé'],
  ['Campinas', 'SP', '19', -22.9099, -47.0626, 'Cambuí', 'Barão Geraldo', 'Centro', 'Taquaral'],
  ['Santos', 'SP', '13', -23.9608, -46.3336, 'Gonzaga', 'Boqueirão', 'Centro', 'Ponta da Praia'],
  ['Guarulhos', 'SP', '11', -23.4538, -46.5333, 'Centro', 'Bosque Maia', 'Cumbica', 'Vila Galvão'],
  ['São Bernardo do Campo', 'SP', '11', -23.6914, -46.5646, 'Centro', 'Jardim do Mar', 'Rudge Ramos', 'Nova Petrópolis'],
  ['Osasco', 'SP', '11', -23.5325, -46.7917, 'Centro', 'Jardim das Flores', 'Km 18', 'Bela Vista'],
  ['Ribeirão Preto', 'SP', '16', -21.1704, -47.8103, 'Jardim Botânico', 'Ribeirânia', 'Centro', 'Alto da Boa Vista'],
  ['Sorocaba', 'SP', '15', -23.5015, -47.4526, 'Campolim', 'Centro', 'Trujillo', 'Jardim Vergueiro'],
  ['São José dos Campos', 'SP', '12', -23.2237, -45.9009, 'Jardim Aquarius', 'Centro', 'Urbanova', 'Vila Adyana'],
  ['Santo André', 'SP', '11', -23.6737, -46.5432, 'Centro', 'Jardim', 'Campestre', 'Vila Assunção'],

  /* ---------------- Sul ---------------- */
  ['Curitiba', 'PR', '41', -25.4284, -49.2733, 'Batel', 'Água Verde', 'Portão', 'Bigorrilho', 'Santa Felicidade'],
  ['Londrina', 'PR', '43', -23.3045, -51.1696, 'Centro', 'Gleba Palhano', 'Aurora', 'Jardim Guanabara'],
  ['Maringá', 'PR', '44', -23.4205, -51.9331, 'Zona 1', 'Zona 7', 'Novo Centro', 'Jardim Alvorada'],
  ['Ponta Grossa', 'PR', '42', -25.0916, -50.1668, 'Centro', 'Estrela', 'Oficinas', 'Uvaranas'],
  ['Cascavel', 'PR', '45', -24.9555, -53.4552, 'Centro', 'Country', 'Neva', 'Cancelli'],
  ['São José dos Pinhais', 'PR', '41', -25.5313, -49.206, 'Centro', 'Afonso Pena', 'Borda do Campo', 'Cidade Jardim'],
  ['Colombo', 'PR', '41', -25.2925, -49.2242, 'Centro', 'Maracanã', 'Osasco', 'Palmital'],
  ['Araucária', 'PR', '41', -25.5936, -49.4103, 'Centro', 'Iguaçu', 'Costeira', 'Chapada'],
  ['Pinhais', 'PR', '41', -25.4447, -49.1925, 'Centro', 'Weissópolis', 'Pineville', 'Jardim Cláudia'],
  ['Campo Largo', 'PR', '41', -25.459, -49.53, 'Centro', 'Ferraria', 'Itaqui', 'Bateias'],
  ['Fazenda Rio Grande', 'PR', '41', -25.6575, -49.3078, 'Centro', 'Nações', 'Eucaliptos', 'Iguaçu'],
  ['Florianópolis', 'SC', '48', -27.5949, -48.5482, 'Centro', 'Lagoa da Conceição', 'Trindade', 'Campeche', 'Jurerê'],
  ['Joinville', 'SC', '47', -26.3045, -48.8487, 'Centro', 'América', 'Boa Vista', 'Atiradores'],
  ['Blumenau', 'SC', '47', -26.9194, -49.0661, 'Centro', 'Velha', 'Garcia', 'Itoupava Norte'],
  ['Chapecó', 'SC', '49', -27.0962, -52.6183, 'Centro', 'Efapi', 'Passo dos Fortes', 'Santa Maria'],
  ['Criciúma', 'SC', '48', -28.6775, -49.3697, 'Centro', 'Próspera', 'Michel', 'Comerciário'],
  ['Porto Alegre', 'RS', '51', -30.0346, -51.2177, 'Moinhos de Vento', 'Bom Fim', 'Cidade Baixa', 'Menino Deus', 'Centro'],
  ['Caxias do Sul', 'RS', '54', -29.1678, -51.1794, 'Centro', 'Panazzolo', 'Exposição', 'São Pelegrino'],
  ['Pelotas', 'RS', '53', -31.7654, -52.3376, 'Centro', 'Três Vendas', 'Fragata', 'Areal'],
  ['Canoas', 'RS', '51', -29.9177, -51.1839, 'Centro', 'Igara', 'Niterói', 'Marechal Rondon'],
  ['Santa Maria', 'RS', '55', -29.6868, -53.8149, 'Centro', 'Camobi', 'Patronato', 'Nossa Senhora de Fátima'],
]

export const BRAZIL_CITIES: City[] = RAW_CITIES.map(
  ([name, state, ddd, lat, lng, ...neighborhoods]) => ({
    name,
    state,
    ddd,
    lat,
    lng,
    neighborhoods,
    region: REGION_BY_UF[state] ?? 'Sudeste',
  }),
)

export function findCity(name: string, state?: string): City | undefined {
  return BRAZIL_CITIES.find(
    (city) => city.name === name && (!state || city.state === state),
  )
}

export const DEFAULT_CITY: City =
  findCity('Curitiba', 'PR') ?? BRAZIL_CITIES[0]

export function cityLabel(city: City): string {
  return `${city.name} - ${city.state}`
}

export const CITY_COUNT = BRAZIL_CITIES.length
export const STATE_COUNT = new Set(BRAZIL_CITIES.map((city) => city.state)).size
