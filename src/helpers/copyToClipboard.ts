export default (value: string): void => {
  const input = document.createElement('input')
  document.body.appendChild(input)

  input.value = value
  input.select()

  document.execCommand('copy')
  document.body.removeChild(input)
}
