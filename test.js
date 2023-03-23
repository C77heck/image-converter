const turn = () => {
    // figure out how to turn them. see the individual numbers how they turn into numbers
    const asciiData = '056 048 048 048 051';
    const asciiArray = asciiData.split(' ');
    const buffer = Buffer.from(asciiArray);

// convert buffer to text
    const text = buffer.toString('utf-8');

    return text;
}

console.log(turn());
