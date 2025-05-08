export interface Tip {
  id: string;
  title: string;
  content: string;
  publishedDate: string;
  category: string[];
  likes: number;
  likedBy: string[];
  createdAt: string;
  author?: {
    _id: string;
    username: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export enum ConsejosCategoria {
  SaludYBienestar = "Salud y bienestar",
  DineroYFinanzas = "Dinero y finanzas",
  RelacionesPersonales = "Relaciones personales",
  CarreraYDesarrolloPersonal = "Carrera profesional y desarrollo personal",
  CrecimientoEmocionalYEspiritual = "Crecimiento emocional y espiritual",
  TiempoLibreYProductividad = "Tiempo libre y productividad",
  EducacionYAprendizaje = "Educación y aprendizaje",
  EstiloDeVidaYModa = "Estilo de vida y moda"
}

export enum AdviceCategory {
  HealthAndWellness = "Health and Wellness",
  MoneyAndFinance = "Money and Finance",
  PersonalRelationships = "Personal Relationships",
  CareerAndPersonalDevelopment = "Career and Personal Development",
  EmotionalAndSpiritualGrowth = "Emotional and Spiritual Growth",
  FreeTimeAndProductivity = "Free Time and Productivity",
  EducationAndLearning = "Education and Learning",
  LifestyleAndFashion = "Lifestyle and Fashion"
}