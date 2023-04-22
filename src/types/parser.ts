export interface LessonDay {
  date:    Date;
  lessons: Lesson[];
}

export interface Lesson {
  text:       string;
  time_start: Date;
  time_end:   Date;
  additional?: AdditionalLessonData;
}

/**
 * - `practice`: Практика
 * - `lecture`: Лекция
 * - `library_day`: Библиотечный день (в 2023 году не встречался)
 * - `project_work`: Проектная деятельность (в 2023 году не встречался)
 * - `exam`: Экзамен
 * - `subject_report`: Зачёт
 */
type AdditionalLessonDataType = 'practice' | 'lecture' | 'library_day' | 'project_work' | 'exam' | 'subject_report'

export interface AdditionalLessonData {
  is_online?: boolean;
  type?: AdditionalLessonDataType;
  url?: string;
  subgroup?: string;
  location?: string;
  custom_time?: {
    start: Date;
    end: Date;
  };
  teacher_name?: string;
}