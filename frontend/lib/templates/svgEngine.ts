/** Fill {{variable}} placeholders in template SVG strings. */
export function fillTemplateVariables(
  svgString: string,
  variables: Record<string, string>
): string {
  let result = svgString
  for (const [key, value] of Object.entries(variables)) {
    result = result.replaceAll(`{{${key}}}`, value || '')
  }
  return result
}
