import React from 'react'

const ConnectionTestButton = ({ socket }) => {

  const handleConnect = () => {
    if (socket.connected)
      socket.disconnect();
    else
      socket.connect();
  }

  return (
    <div>
      <button onClick={handleConnect}>{socket.connected ? ("Connect") : ("disconnect")}</button>
    </div>
  )
}

export default ConnectionTestButton
