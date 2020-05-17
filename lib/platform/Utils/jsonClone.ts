// Clone a JSON compatible object.

export default function(json: any) {
  return JSON.parse(JSON.stringify(json))
}
