import React, { Component } from 'react';
import './blocks.css';

class Blocks extends Component {
  constructor() {
    super();
    this.state = {
        blocks: []
      }
    }

componentDidMount() {
  fetch('/api/blocks')
    .then(res => res.json())
    .then(blocks => this.setState({blocks}, () => console.log('blocks fetched..',
    blocks)));
}

  render() {
    return (
      <div>
        <h2>blocks</h2>
        <ul>
          {this.state.blocks.map(block =>
            <li key={block.id}> { block.firstName } { block.lastName } </li>
          )}
        </ul>
      </div>
    );
  }
}

export default Blocks;
