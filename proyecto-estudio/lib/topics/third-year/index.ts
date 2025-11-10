import { laMateriaTopic } from "./la-materia";
import { laQuimicaTopic } from "./la-quimica";
import { laClasificacionDeLaMateriaTopic } from "./la-clasificacion-de-la-materia";
import { losMetodosDeSeparacionTopic } from "./los-metodos-de-separacion";
import { lasPropiedadesDeLaMateriaTopic } from "./las-propiedades-de-la-materia";
import { losEstadosDeAgregacionTopic } from "./los-estados-de-agragacion";
import type { TopicContent, TopicId } from "./types";

export const thirdYearTopics = [
  laMateriaTopic,
  laQuimicaTopic,
  laClasificacionDeLaMateriaTopic,
  lasPropiedadesDeLaMateriaTopic,
  losMetodosDeSeparacionTopic,
  losEstadosDeAgregacionTopic,
] as const satisfies readonly TopicContent[];

export type ThirdYearTopicId = TopicId<typeof thirdYearTopics>;

export const getThirdYearTopic = (id: string): TopicContent | undefined =>
  thirdYearTopics.find((topic) => topic.id === id);
