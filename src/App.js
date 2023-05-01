import React, { useState, useEffect } from "react";
import { Header, Button, Input, List, Form } from "semantic-ui-react";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";

function App() {
  const [manager, setManager] = useState("0x");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("0");
  const [message, setMessage] = useState("");
  const [tickets, setTickets] = useState(0);

  useEffect(() => {
    const loadContractData = async () => {
      setManager(await lottery.methods.manager().call());
      setPlayers(await lottery.methods.getPlayers().call());
      setBalance(await web3.eth.getBalance(lottery.options.address));
    };

    loadContractData();
  }, []);

  const enterLottery = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting on transaction success...");

    console.log(lottery);

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });

    setMessage("You have been entered!");
  };

  const pickAWinner = async () => {
    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting on transaction success...");

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    setMessage("A winner has been picked!");
  };

  return (
    <div className="App">
      <Header size="large">Lottery Contract</Header>

      <div className="container">
        <div className="section">
          <Header size="medium">Would you like to play?</Header>

          <List>
            <List.Item>The contract is managed by {manager}</List.Item>
            <List.Item>
              Number of players that already joined: {players.length}
            </List.Item>
            {players.map((player) => {
              return <span>{player}</span>;
            })}
            <List.Item>Reward: {balance} ETH</List.Item>
          </List>
        </div>

        <div className="section">
          <Form onSubmit={enterLottery}>
            <h3>Would you like to try?</h3>

            <Form.Field>
              <label>Number of tickets (Each ticket is 1 ETH)</label>

              <Input
                label={{ basic: true, content: "ETH" }}
                labelPosition="right"
                placeholder="Enter weight..."
                value={tickets}
                onChange={(e) => setTickets(e.target.value)}
              />
            </Form.Field>

            <Button size="small" color="green">
              Enter
            </Button>
          </Form>
        </div>
      </div>

      <h4>Ready to pick a winner?</h4>
      <Button size="small" color="green" onClick={pickAWinner}>
        Pick a winner!
      </Button>

      <h1>{message}</h1>
    </div>
  );
}

export default App;
