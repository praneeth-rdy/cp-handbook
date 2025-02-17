/**
 * Converts snake_case JSON problem data to camelCase format
 * @param jsonData Raw JSON data from AZ problem file
 * @returns Parsed problem data with camelCase properties
 */
export function parseProblemData(jsonData: any) {
  return {
    body: jsonData.body,
    completeApproach: jsonData.complete_approach,
    constraints: jsonData.constraints, 
    difficulty: jsonData.difficulty,
    editorialCode: jsonData.editorial_code,
    healthCheck: {
      issues: jsonData.health_check.issues,
      lastUpdated: jsonData.health_check.last_updated
    },
    hints: {
      ...Object.keys(jsonData.hints)
        .filter(key => key !== 'solution_approach')
        .reduce((acc, key) => ({
          ...acc,
          [key]: jsonData.hints[key]
        }), {}),
      solutionApproach: jsonData.hints.solution_approach
    },
    id: jsonData.id,
    inputFormat: jsonData.input_format,
    languages: jsonData.languages,
    memoryLimitMb: jsonData.memory_limit_mb,
    note: jsonData.note,
    outputFormat: jsonData.output_format,
    samples: jsonData.samples,
    status: jsonData.status,
    tags: jsonData.tags,
    templateCode: jsonData.template_code,
    timeLimitSec: jsonData.time_limit_sec,
    title: jsonData.title,
    videoEditorialId: jsonData.video_editorial_id
  };
}

export function parseChaptersData(data: any) {
  return data.map((chapter: any) => ({
      id: chapter.id,
      name: chapter.name,
      code: chapter.code,
      description: chapter.description,
      timeInMinutes: chapter.time_in_minutes
    }))
}

export function parseModulesData(data: any) {
  return data.map((module: any) => ({
    id: module.id,
    name: module.name,
    description: module.description,
    resourcesCount: module.resources_count,
    timeInMinutes: module.time_in_minutes,
    type: module.type
  }))
}
