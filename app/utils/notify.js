export default function (title, message) {
  const n = new Notification(title, {
    body: message
  })

  n.onclick = () => {
    console.log('click')
  }
}
