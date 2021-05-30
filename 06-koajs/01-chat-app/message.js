const timeFormatter = new Intl.DateTimeFormat('ru', {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
});

class Message {
  constructor(text) {
    this.text = text;
    this.dataTime = new Date();
  }

  render() {
    return `${timeFormatter.format(this.dataTime)}: ${this.text}`;
  }
}

module.exports = Message;
