import type { Locale } from "./i18n/config";

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  content: string;
  question: {
    prompt: string;
    options: string[];
    correctIndex: number;
  };
}

interface LessonSource {
  id: string;
  es: Omit<Lesson, "id">;
  en: Omit<Lesson, "id">;
}

const LESSON_SOURCES: LessonSource[] = [
  {
    id: "regla-50-30-20",
    es: {
      title: "La regla 50/30/20",
      summary: "Un reparto sencillo para organizar cualquier ingreso.",
      content:
        "Divide tus ingresos netos en tres bloques: 50% para necesidades (vivienda, comida, transporte), 30% para deseos (ocio, caprichos) y 20% para ahorro e inversión. No es una ley física, pero da un punto de partida claro para revisar si tu gasto está desequilibrado.",
      question: {
        prompt: "Según la regla 50/30/20, ¿qué porcentaje debería ir a ahorro e inversión?",
        options: ["50%", "30%", "20%"],
        correctIndex: 2,
      },
    },
    en: {
      title: "The 50/30/20 rule",
      summary: "A simple split to organize any income.",
      content:
        "Split your net income into three buckets: 50% for needs (housing, food, transport), 30% for wants (leisure, treats), and 20% for savings and investing. It's not a law of physics, but it gives you a clear starting point to check whether your spending is out of balance.",
      question: {
        prompt: "According to the 50/30/20 rule, what percentage should go to savings and investing?",
        options: ["50%", "30%", "20%"],
        correctIndex: 2,
      },
    },
  },
  {
    id: "fondo-emergencia",
    es: {
      title: "El fondo de emergencia",
      summary: "Tu colchón para imprevistos antes de invertir.",
      content:
        "Antes de invertir a largo plazo, conviene tener entre 3 y 6 meses de gastos básicos en una cuenta accesible. Este fondo evita que un imprevisto (coche, salud, pérdida de ingresos) te obligue a endeudarte o a vender inversiones en mal momento.",
      question: {
        prompt: "¿Cuántos meses de gastos suele recomendarse tener en el fondo de emergencia?",
        options: ["3-6 meses", "1 semana", "2 años"],
        correctIndex: 0,
      },
    },
    en: {
      title: "The emergency fund",
      summary: "Your cushion for the unexpected before you invest.",
      content:
        "Before investing for the long term, it's worth keeping 3 to 6 months of basic expenses in an accessible account. This fund keeps an unexpected event (car, health, loss of income) from forcing you into debt or into selling investments at a bad time.",
      question: {
        prompt: "How many months of expenses is usually recommended for an emergency fund?",
        options: ["3-6 months", "1 week", "2 years"],
        correctIndex: 0,
      },
    },
  },
  {
    id: "interes-compuesto",
    es: {
      title: "Interés compuesto",
      summary: "Por qué empezar antes importa más que aportar más.",
      content:
        "El interés compuesto es el interés que generan tanto tu capital inicial como los intereses ya acumulados. Cuanto antes empieces a ahorrar, más tiempo tiene tu dinero para crecer sobre sí mismo. Prueba el simulador en Estrategias para ver el efecto del tiempo.",
      question: {
        prompt: "El interés compuesto genera rendimientos sobre...",
        options: [
          "Solo el capital inicial",
          "El capital inicial y los intereses acumulados",
          "Solo las aportaciones del último año",
        ],
        correctIndex: 1,
      },
    },
    en: {
      title: "Compound interest",
      summary: "Why starting earlier matters more than contributing more.",
      content:
        "Compound interest is the interest earned on both your initial capital and the interest already accumulated. The earlier you start saving, the more time your money has to grow on itself. Try the simulator in Strategies to see the effect of time.",
      question: {
        prompt: "Compound interest generates returns on...",
        options: [
          "Only the initial capital",
          "The initial capital and the accumulated interest",
          "Only last year's contributions",
        ],
        correctIndex: 1,
      },
    },
  },
  {
    id: "deuda-buena-mala",
    es: {
      title: "Deuda buena vs. deuda mala",
      summary: "No toda deuda es igual de peligrosa.",
      content:
        "La deuda 'buena' financia algo que aumenta tu patrimonio o tu capacidad de generar ingresos (una hipoteca razonable, estudios). La deuda 'mala' financia consumo que pierde valor de inmediato y suele tener intereses altos, como el crédito revolving o los aplazamientos de tarjeta.",
      question: {
        prompt: "¿Cuál de estas suele considerarse deuda 'mala'?",
        options: [
          "Una hipoteca a tipo razonable",
          "Crédito revolving para consumo",
          "Un préstamo de estudios con buena empleabilidad",
        ],
        correctIndex: 1,
      },
    },
    en: {
      title: "Good debt vs. bad debt",
      summary: "Not all debt is equally dangerous.",
      content:
        "'Good' debt finances something that grows your net worth or your ability to earn income (a reasonable mortgage, an education). 'Bad' debt finances consumption that loses value immediately and usually carries high interest, like revolving credit or card installment plans.",
      question: {
        prompt: "Which of these is usually considered 'bad' debt?",
        options: [
          "A mortgage at a reasonable rate",
          "Revolving credit for consumption",
          "A student loan with good job prospects",
        ],
        correctIndex: 1,
      },
    },
  },
  {
    id: "diversificacion",
    es: {
      title: "Diversificación",
      summary: "No pongas todos los huevos en la misma cesta.",
      content:
        "Repartir tus inversiones entre distintos activos, sectores y geografías reduce el impacto de que uno de ellos vaya mal. No elimina el riesgo, pero evita que un solo fracaso arrastre todo tu patrimonio.",
      question: {
        prompt: "¿Cuál es el principal beneficio de diversificar?",
        options: [
          "Garantiza ganancias todos los años",
          "Reduce el impacto de que una sola inversión vaya mal",
          "Elimina por completo el riesgo",
        ],
        correctIndex: 1,
      },
    },
    en: {
      title: "Diversification",
      summary: "Don't put all your eggs in one basket.",
      content:
        "Spreading your investments across different assets, sectors, and geographies reduces the impact of any single one going wrong. It doesn't eliminate risk, but it stops one failure from dragging down your entire net worth.",
      question: {
        prompt: "What's the main benefit of diversifying?",
        options: [
          "It guarantees gains every year",
          "It reduces the impact of any single investment going wrong",
          "It completely eliminates risk",
        ],
        correctIndex: 1,
      },
    },
  },
];

export function getLessons(locale: Locale): Lesson[] {
  return LESSON_SOURCES.map(({ id, es, en }) => ({ id, ...(locale === "en" ? en : es) }));
}
