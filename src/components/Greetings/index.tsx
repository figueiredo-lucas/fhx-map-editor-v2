import { Button } from '../Button'
import './styles.scss';

export function Greetings() {
  function handleSayHello() {
    window.Main.sendMessage('Hello World');

    console.log('Message sent! Check main process log in terminal.')
  }

  return (
    <div className="container">
      <img className="img"
        src="https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg"
        alt="ReactJS logo"
      />
      <p className="paragraph">An Electron boilerplate including TypeScript, React, Jest and ESLint.</p>
      <Button onClick={handleSayHello}>Send message to main process</Button>
    </div>
  )
}

