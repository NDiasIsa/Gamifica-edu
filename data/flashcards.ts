import type { CardProgress, Flashcard, SubjectId, Topic } from '@/types/game';

// Perguntas de exemplo, no lugar das que o professor cadastrará.
// Cada linha: [pergunta, resposta certa, ...alternativas erradas].
type CardRow = [question: string, answer: string, ...distractors: string[]];

type TopicSeed = {
  id: string;
  subjectId: SubjectId;
  name: string;
  cards: CardRow[];
};

const seeds: TopicSeed[] = [
  // Matemática
  {
    id: 'mat-equacoes',
    subjectId: 'matematica',
    name: 'Equações do 1º grau',
    cards: [
      ['Qual é o valor de x em 2x + 6 = 14?', '4', '3', '8', '10'],
      ['Resolva: 5x − 3 = 22.', 'x = 5', 'x = 4', 'x = 19', 'x = 25'],
      ['Qual equação representa "o triplo de um número mais 4 é 19"?', '3x + 4 = 19', '3(x + 4) = 19', 'x + 3 = 19', '4x + 3 = 19'],
      ['Se x/3 = 7, quanto vale x?', '21', '10', '4', '7/3'],
    ],
  },
  {
    id: 'mat-fracoes',
    subjectId: 'matematica',
    name: 'Frações e decimais',
    cards: [
      ['Quanto é 3/4 em número decimal?', '0,75', '0,34', '0,43', '1,33'],
      ['Qual fração é equivalente a 2/5?', '4/10', '5/2', '2/10', '4/5'],
      ['Quanto é 1/2 + 1/4?', '3/4', '2/6', '1/6', '2/4'],
      ['Qual é a forma simplificada de 12/18?', '2/3', '6/8', '3/4', '4/9'],
    ],
  },
  {
    id: 'mat-porcentagem',
    subjectId: 'matematica',
    name: 'Porcentagem',
    cards: [
      ['Quanto é 25% de 80?', '20', '25', '16', '32'],
      ['Um produto de R$ 50 teve 10% de desconto. Quanto custa agora?', 'R$ 45', 'R$ 40', 'R$ 49', 'R$ 55'],
      ['30% corresponde a qual fração?', '3/10', '1/3', '3/100', '30/10'],
      ['Numa turma de 40 alunos, 60% são meninas. Quantas meninas há?', '24', '16', '20', '60'],
    ],
  },
  {
    id: 'mat-inteiros',
    subjectId: 'matematica',
    name: 'Números inteiros',
    cards: [
      ['Quanto é (−8) + 5?', '−3', '3', '−13', '13'],
      ['Qual é o resultado de (−4) × (−6)?', '24', '−24', '−10', '10'],
      ['Qual destes números é o maior?', '−2', '−5', '−10', '−7'],
      ['A temperatura era −3 °C e subiu 7 °C. Qual é a nova temperatura?', '4 °C', '−10 °C', '10 °C', '−4 °C'],
    ],
  },

  // Português
  {
    id: 'por-classes',
    subjectId: 'portugues',
    name: 'Classes de palavras',
    cards: [
      ['Na frase "O menino correu rápido", qual palavra é um verbo?', 'correu', 'menino', 'rápido', 'O'],
      ['Qual destas palavras é um adjetivo?', 'bonito', 'correr', 'ontem', 'mesa'],
      ['Em "Eles chegaram cedo", a palavra "Eles" é um:', 'pronome', 'substantivo', 'advérbio', 'artigo'],
      ['Qual destas palavras é um advérbio de tempo?', 'amanhã', 'alegre', 'casa', 'muito'],
    ],
  },
  {
    id: 'por-acentuacao',
    subjectId: 'portugues',
    name: 'Acentuação',
    cards: [
      ['Qual palavra está escrita corretamente?', 'café', 'raíz', 'ítem', 'juíz'],
      ['Por que "lâmpada" tem acento?', 'É uma proparoxítona', 'É uma oxítona terminada em a', 'É uma paroxítona terminada em a', 'Tem ditongo aberto'],
      ['Qual destas palavras é oxítona?', 'sofá', 'mesa', 'árvore', 'lápis'],
      ['Qual é a sílaba tônica de "caderno"?', 'der', 'ca', 'no', 'Não tem sílaba tônica'],
    ],
  },
  {
    id: 'por-sujeito',
    subjectId: 'portugues',
    name: 'Sujeito e predicado',
    cards: [
      ['Qual é o sujeito em "As crianças brincaram no parque"?', 'As crianças', 'brincaram', 'no parque', 'brincaram no parque'],
      ['Em "Choveu muito ontem", como é classificado o sujeito?', 'Oração sem sujeito', 'Sujeito oculto', 'Sujeito simples', 'Sujeito composto'],
      ['Em "Ana e Pedro estudaram", o sujeito é:', 'Composto', 'Simples', 'Oculto', 'Indeterminado'],
    ],
  },
  {
    id: 'por-figuras',
    subjectId: 'portugues',
    name: 'Figuras de linguagem',
    cards: [
      ['"Seus olhos são duas estrelas" é um exemplo de:', 'Metáfora', 'Hipérbole', 'Onomatopeia', 'Ironia'],
      ['"Já te disse isso um milhão de vezes" é um exemplo de:', 'Hipérbole', 'Metáfora', 'Comparação', 'Personificação'],
      ['Em "O vento cantava na janela" temos uma:', 'Personificação', 'Hipérbole', 'Ironia', 'Onomatopeia'],
      ['"Tic-tac" representa qual figura de linguagem?', 'Onomatopeia', 'Metáfora', 'Hipérbole', 'Antítese'],
    ],
  },

  // História
  {
    id: 'his-colonial',
    subjectId: 'historia',
    name: 'Brasil Colonial',
    cards: [
      ['Em que ano a esquadra de Cabral chegou ao território que hoje é o Brasil?', '1500', '1492', '1822', '1530'],
      ['Qual foi o primeiro produto explorado pelos portugueses no Brasil?', 'Pau-brasil', 'Café', 'Ouro', 'Borracha'],
      ['Como se chamavam as grandes faixas de terra entregues a donatários?', 'Capitanias hereditárias', 'Províncias imperiais', 'Quilombos', 'Missões jesuíticas'],
      ['Em que século o ciclo do ouro teve seu auge em Minas Gerais?', 'Século XVIII', 'Século XVI', 'Século XIX', 'Século XX'],
    ],
  },
  {
    id: 'his-africa',
    subjectId: 'historia',
    name: 'Povos africanos no Brasil',
    cards: [
      ['Como se chamavam as comunidades formadas por pessoas escravizadas que fugiam?', 'Quilombos', 'Aldeias', 'Missões', 'Engenhos'],
      ['Quem foi o líder mais conhecido do Quilombo dos Palmares?', 'Zumbi', 'Tiradentes', 'Dom Pedro I', 'José de Anchieta'],
      ['Qual religião de matriz africana se desenvolveu no Brasil?', 'Candomblé', 'Budismo', 'Hinduísmo', 'Xintoísmo'],
      ['Em que ano a Lei Áurea aboliu a escravidão no Brasil?', '1888', '1822', '1889', '1850'],
    ],
  },
  {
    id: 'his-medieval',
    subjectId: 'historia',
    name: 'Idade Média',
    cards: [
      ['Como se chamava o grande proprietário de terras no feudalismo?', 'Senhor feudal', 'Burguês', 'Servo', 'Imperador'],
      ['Qual grupo trabalhava nas terras do senhor feudal em troca de proteção?', 'Servos', 'Cavaleiros', 'Clérigos', 'Mercadores'],
      ['Qual instituição tinha grande poder na Europa medieval?', 'Igreja Católica', 'Parlamento', 'Bolsa de Valores', 'Nações Unidas'],
    ],
  },
  {
    id: 'his-navegacoes',
    subjectId: 'historia',
    name: 'Grandes Navegações',
    cards: [
      ['Qual país foi pioneiro nas Grandes Navegações?', 'Portugal', 'Inglaterra', 'Alemanha', 'Itália'],
      ['Quem chegou à América em 1492?', 'Cristóvão Colombo', 'Pedro Álvares Cabral', 'Vasco da Gama', 'Fernão de Magalhães'],
      ['Que instrumento ajudava os navegadores a se orientar?', 'Bússola', 'Telescópio', 'Relógio de sol', 'Barômetro'],
      ['Qual navegador chegou às Índias contornando a África em 1498?', 'Vasco da Gama', 'Cristóvão Colombo', 'Pedro Álvares Cabral', 'Américo Vespúcio'],
    ],
  },

  // Ciências
  {
    id: 'cie-sistema-solar',
    subjectId: 'ciencias',
    name: 'Sistema Solar',
    cards: [
      ['Qual é o planeta mais próximo do Sol?', 'Mercúrio', 'Vênus', 'Terra', 'Marte'],
      ['Qual é o maior planeta do Sistema Solar?', 'Júpiter', 'Saturno', 'Netuno', 'Terra'],
      ['Qual planeta é conhecido como "planeta vermelho"?', 'Marte', 'Vênus', 'Júpiter', 'Mercúrio'],
      ['Quanto tempo a Terra leva para dar uma volta completa ao redor do Sol?', 'Cerca de 365 dias', '24 horas', '30 dias', '7 dias'],
    ],
  },
  {
    id: 'cie-celulas',
    subjectId: 'ciencias',
    name: 'Células',
    cards: [
      ['Qual estrutura da célula guarda o material genético?', 'Núcleo', 'Membrana plasmática', 'Citoplasma', 'Parede celular'],
      ['Qual organela realiza a fotossíntese nas células vegetais?', 'Cloroplasto', 'Mitocôndria', 'Ribossomo', 'Núcleo'],
      ['Qual organela é responsável pela respiração celular?', 'Mitocôndria', 'Cloroplasto', 'Vacúolo', 'Lisossomo'],
      ['Seres formados por uma única célula são chamados de:', 'Unicelulares', 'Pluricelulares', 'Vertebrados', 'Invertebrados'],
    ],
  },
  {
    id: 'cie-ecologia',
    subjectId: 'ciencias',
    name: 'Ecologia',
    cards: [
      ['Em uma cadeia alimentar, as plantas são:', 'Produtoras', 'Consumidoras primárias', 'Decompositoras', 'Predadoras'],
      ['Qual é o papel dos fungos e bactérias decompositores?', 'Decompor a matéria orgânica', 'Produzir luz', 'Caçar outros animais', 'Polinizar flores'],
      ['Qual gás as plantas liberam na fotossíntese?', 'Oxigênio', 'Gás carbônico', 'Nitrogênio', 'Metano'],
    ],
  },
  {
    id: 'cie-materia',
    subjectId: 'ciencias',
    name: 'Estados da matéria',
    cards: [
      ['Como se chama a passagem do estado líquido para o gasoso?', 'Vaporização', 'Fusão', 'Solidificação', 'Condensação'],
      ['Ao nível do mar, a água pura congela a quantos graus Celsius?', '0 °C', '100 °C', '−10 °C', '32 °C'],
      ['Qual é o nome da passagem do estado gasoso para o líquido?', 'Condensação', 'Sublimação', 'Fusão', 'Solidificação'],
      ['Em qual estado a matéria tem forma e volume definidos?', 'Sólido', 'Líquido', 'Gasoso', 'Nenhum deles'],
    ],
  },
];

export const topics: Topic[] = seeds.map(({ id, subjectId, name }) => ({ id, subjectId, name }));

export const flashcards: Flashcard[] = seeds.flatMap((topic) =>
  topic.cards.map(([question, answer, ...distractors], index) => ({
    id: `${topic.id}-${index + 1}`,
    subjectId: topic.subjectId,
    topicId: topic.id,
    question,
    answer,
    distractors,
  })),
);

const DAY = 86_400_000;

/**
 * Progresso inicial da aluna de exemplo: [card, estado, revisões, dias até voltar].
 * Dias negativos = card já disponível para a próxima rodada.
 */
const progressSeed: [string, CardProgress['state'], number, number][] = [
  ['mat-equacoes-1', 'revisar', 2, -1],
  ['mat-equacoes-2', 'revisar', 1, -2],
  ['mat-equacoes-3', 'aprendendo', 0, -1],
  ['mat-fracoes-1', 'revisar', 3, 4],
  ['mat-fracoes-2', 'revisar', 1, -1],
  ['mat-fracoes-3', 'aprendendo', 0, 1],
  ['mat-porcentagem-1', 'aprendendo', 0, -1],
  ['mat-inteiros-1', 'revisar', 2, 2],
  ['por-classes-1', 'revisar', 1, -1],
  ['por-classes-2', 'aprendendo', 0, -1],
  ['por-figuras-1', 'revisar', 2, 3],
  ['his-colonial-1', 'revisar', 2, -1],
  ['his-colonial-2', 'revisar', 1, -3],
  ['his-colonial-3', 'aprendendo', 0, -1],
  ['his-africa-1', 'revisar', 1, 2],
  ['his-africa-2', 'aprendendo', 0, 1],
  ['his-navegacoes-1', 'revisar', 3, -1],
  ['cie-sistema-solar-1', 'aprendendo', 0, -1],
  ['cie-celulas-2', 'revisar', 1, -1],
];

export function createInitialCardProgress(now: number): Record<string, CardProgress> {
  return Object.fromEntries(
    progressSeed.map(([cardId, state, reviews, dueInDays]) => [
      cardId,
      {
        state,
        reviews,
        dueAt: now + dueInDays * DAY,
        // Novo → aprendendo rende 20 XP; cada revisão acertada rende mais 10 ou 5.
        xpEarned: state === 'aprendendo' ? 20 : 30 + 5 * (reviews - 1),
      },
    ]),
  );
}
