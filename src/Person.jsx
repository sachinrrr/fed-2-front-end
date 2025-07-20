function Person(props) {

  const add = (a, b) => {
    return a + b;
  }

  return (
    <>
      <h1>My name is {props.name}</h1>
      <h3>I am {props.age} years old</h3>
      <h3>I live in {props.city}</h3>
      <h3>the sum of 2 and 3 is {add(2, 3)}</h3>
    </>
  );
}

export default Person;