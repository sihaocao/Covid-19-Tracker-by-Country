import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Columns from 'react-columns';
import Form from 'react-bootstrap/Form';

function App() {
  const [latest, setLatest] = useState([]);
  const [results, setResults] = useState([]);
  const [searchCountries, setSearchCountries] = useState('');

  useEffect(() => {
    axios
      .all([
        axios.get('https://corona.lmao.ninja/v2/all'),
        axios.get('https://corona.lmao.ninja/v2/countries')
      ])
      .then(responseArr => {
        setLatest(responseArr[0].data);
        setResults(responseArr[1].data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const date = new Date(parseInt(latest.updated));
  const lastUpdated = date.toString().slice(4, 15);

  const worldCases = parseInt(latest.cases).toLocaleString('en');
  const worldDeaths = parseInt(latest.deaths).toLocaleString('en');
  const worldRecovered = parseInt(latest.recovered).toLocaleString('en');

  const filterCountries = results.filter(item => {
    return searchCountries !== ''
      ? item.country.toLowerCase().includes(searchCountries.toLowerCase())
      : item;
  });

  const countries = filterCountries.map((data, i) => {
    const countryCases = parseInt(data.cases).toLocaleString('en');
    const countryDeaths = parseInt(data.deaths).toLocaleString('en');
    const countryRecovered = parseInt(data.recovered).toLocaleString('en');
    const countryTodayCases = parseInt(data.todayCases).toLocaleString('en');
    const countryTodayDeaths = parseInt(data.todayDeaths).toLocaleString('en');
    const countryActive = parseInt(data.active).toLocaleString('en');
    const countryCritical = parseInt(data.critical).toLocaleString('en');

    return (
      <Card
        key={i}
        bg='light'
        text='dark'
        className='text-center'
        style={{ margin: '10px' }}
      >
        <Card.Img variant='top' src={data.countryInfo.flag} />
        <Card.Body>
          <Card.Title>{data.country}</Card.Title>
          <Card.Text>Total Cases: {countryCases}</Card.Text>
          <Card.Text>Total Deaths: {countryDeaths}</Card.Text>
          <Card.Text>Total Recovered: {countryRecovered}</Card.Text>
          <Card.Text>Today's Cases: {countryTodayCases}</Card.Text>
          <Card.Text>Today's Deaths: {countryTodayDeaths}</Card.Text>
          <Card.Text>Total Active Cases: {countryActive}</Card.Text>
          <Card.Text>Total Critical Cases: {countryCritical}</Card.Text>
        </Card.Body>
      </Card>
    );
  });

  const queries = [
    {
      columns: 2,
      query: 'min-width: 500px'
    },
    {
      columns: 3,
      query: 'min-width: 1000px'
    }
  ];

  return (
    <div>
      <br />
      <h2 style={{ textAlign: 'center' }}>Covid-19 Live Stats</h2>
      <br />
      <CardDeck>
        <Card
          bg='secondary'
          text={'white'}
          className='text-center'
          style={{ margin: '10px' }}
        >
          <Card.Body>
            <Card.Title>Total Cases: Worldwide</Card.Title>
            <Card.Text>{worldCases}</Card.Text>
          </Card.Body>
          <Card.Footer>
            <small>Last updated: {lastUpdated}</small>
          </Card.Footer>
        </Card>
        <Card
          bg='danger'
          text={'white'}
          className='text-center'
          style={{ margin: '10px' }}
        >
          <Card.Body>
            <Card.Title>Total Deaths: Worldwide</Card.Title>
            <Card.Text>{worldDeaths}</Card.Text>
          </Card.Body>
          <Card.Footer>
            <small>Last updated: {lastUpdated}</small>
          </Card.Footer>
        </Card>
        <Card
          bg='success'
          text={'white'}
          className='text-center'
          style={{ margin: '10px' }}
        >
          <Card.Body>
            <Card.Title>Total Recovered: Worldwide</Card.Title>
            <Card.Text>{worldRecovered}</Card.Text>
          </Card.Body>
          <Card.Footer>
            <small>Last updated: {lastUpdated}</small>
          </Card.Footer>
        </Card>
      </CardDeck>
      <br />
      <Form>
        <Form.Group controlId='formGroupSearch'>
          <Form.Control
            type='text'
            placeholder='Search a Country'
            onChange={e => setSearchCountries(e.target.value)}
          />
        </Form.Group>
      </Form>
      <Columns queries={queries}>{countries}</Columns>
    </div>
  );
}

export default App;
