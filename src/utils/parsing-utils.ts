/**
 * Converts snake_case JSON problem data to camelCase format
 * @param jsonData Raw JSON data from Algozenith problem file
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
      hint1: jsonData.hints.hint1,
      hint2: jsonData.hints.hint2,
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
