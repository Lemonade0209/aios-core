export function optional(value: FormDataEntryValue | null) {
  const text = value?.toString().trim();
  return text ? text : undefined;
}

export function optionalNumber(value: FormDataEntryValue | null) {
  const text = optional(value);
  return text ? Number(text) : undefined;
}

export function splitTags(value: FormDataEntryValue | null) {
  return optional(value)
    ?.split(',')
    .map((tag) => tag.trim())
    .filter(Boolean) ?? [];
}
