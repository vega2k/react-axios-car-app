import React, { Component } from 'react';
import logo from './mainStreetAuto.svg';
import axios from 'axios';
import './App.css';

// Toast notification dependencies
import { ToastContainer, toast } from 'react-toastify';


const baseUrl = 'https://joes-autos.herokuapp.com/api';

class App extends Component {
  constructor( props ) {
    super( props );

    this.state = {
      vehiclesToDisplay: [],
      buyersToDisplay: []
    };
  }

  getVehicles = () => {
    axios.get(`${baseUrl}/vehicles`).then(response => {
      this.setState({vehiclesToDisplay: response.data})
      toast.success('Successfully got Vehicles.')
    }).catch(err => toast.error('Failed at fetching Vehicles', err));
  }

  getPotentialBuyers = () => {
    axios.get(`${baseUrl}/buyers`).then(buyers => {
      this.setState({ buyersToDisplay: buyers.data })
    });
  }

  sellCar = ( id ) => {
    axios.delete(`${baseUrl}/vehicles/${id}`).then(res => {
      console.log(res)
      this.setState({
        vehiclesToDisplay: res.data.vehicles
      })
      toast.success('Successfully Sell Car.')
    }).catch(() => toast.error('Failed at sell car'));
  }

  filterByMake = () => {
    let make = this.refs.selectedMake.value;

    axios.get(`${baseUrl}/vehicles/?make=${make}`).then(vehicles => {
      console.log(vehicles)
      // let newArray = vehicles.data.filter(e => e.make === make)
      // this.setState({vehiclesToDisplay: newArray})
      this.setState({vehiclesToDisplay: vehicles.data})
    })
  }

  filterByColor = () => {
    let color = this.refs.selectedColor.value;

    axios.get(`${baseUrl}/vehicles/?color=${color}`).then(vehicles => {
      // let newArray = vehicles.data.filter(e => e.color === color)
      // this.setState({vehiclesToDisplay: newArray})
      this.setState({vehiclesToDisplay: vehicles.data})

    })
  }

  updatePrice = ( priceChange, id ) => {
    axios.put(`${baseUrl}/vehicles/${id}/${priceChange}`).then(res => {
      console.log(res.data.vehicles)
      this.setState({
        vehiclesToDisplay: res.data.vehicles
      })
      toast.success('That price be updated, 🤙 ')
    }).catch(() => toast.error('Uh oh!'))
  }

  addCar = () => {
    let newCar = {
      make: this.refs.make.value,
      model: this.refs.model.value,
      color: this.refs.color.value,
      year: this.refs.year.value,
      price: this.refs.price.value
    };

    axios.post(`${baseUrl}/vehicles`, newCar).then(res => {
      this.setState({
        vehiclesToDisplay: res.data.vehicles
      })
      toast.success('Successfully added vehicle.')
    }).catch(() => toast.error('Failed at adding new vehicle.'))

      this.refs.make.value = this.refs.make.placeholder;
      this.refs.model.value = this.refs.model.placeholder;
      this.refs.color.value = this.refs.color.placeholder;
      this.refs.year.value = this.refs.year.placeholder;
      this.refs.price.value = this.refs.price.placeholder;
  }

  addBuyer = () => {
    let newBuyer ={
      name: this.refs.name.value,
      phone: this.refs.phone.value,
      address: this.refs.address.value
    };

    axios.post(`${baseUrl}/buyers`, newBuyer).then(buyers => {
      this.setState({buyersToDisplay: buyers.data.buyers})
    })

    this.refs.name.value = this.refs.name.placeholder.toUpperCase();
    this.refs.phone.value = this.refs.phone.placeholder;
    this.refs.address.value = this.refs.address.placeholder;
  }

  deleteBuyer = ( id ) => {
    axios.delete(`${baseUrl}/buyers/${id}`).then(buyers => {
      console.log(buyers)
      this.setState({buyersToDisplay: buyers.data.buyers})
    })
  }

  nameSearch = () => {
    let searchLetters = this.refs.searchLetters.value;

    axios.get(`${baseUrl}/buyers`).then(buyers => {
      let newBuyers = buyers.data.filter(e => e.name.includes(searchLetters))
      console.log(newBuyers)
      this.setState({buyersToDisplay: newBuyers})
    })
  }

  byYear = () => {
    let year = Number(this.refs.searchYear.value);

    axios.get(`${baseUrl}/vehicles`).then(vehicles => {
      let newArray = vehicles.data.filter(e => e.year === year)
      this.setState({vehiclesToDisplay: newArray})
    })
  }

  // Do not edit the code below
  resetData = ( dataToReset ) => {
      axios.get(`${baseUrl}/${dataToReset}/reset`).then( res => {
        if ( dataToReset === 'vehicles' ) {
        this.setState({ vehiclesToDisplay: res.data.vehicles });
      } else {
        this.setState({ buyersToDisplay: res.data.buyers });
      }
    });
  }
  // Do not edit the code above

  render() {
    const { vehiclesToDisplay, buyersToDisplay } = this.state;
    const { updatePrice, sellCar, deleteBuyer,
      resetData, getVehicles, filterByMake, filterByColor,
      nameSearch, byYear, getPotentialBuyers, addCar, addBuyer } = this;

    const vehicles = vehiclesToDisplay.map( v => {
      return (
        <div key={ v.id }>
          <p>Make: { v.make }</p>
          <p>Model: { v.model }</p>
          <p>Year: { v.year }</p>
          <p>Color: { v.color }</p>
          <p>Price: { v.price }</p>

          <button className='btn btn-sp'
                  onClick={ () => updatePrice( 'up', v.id ) }>
            Increase Price
          </button>

          <button className='btn btn-sp'
                  onClick={ () => updatePrice( 'down', v.id ) }>
            Decrease Price
          </button>

          <button className='btn btn-sp'
                  onClick={ () => sellCar( v.id ) }>
            SOLD!
          </button>
          
          <hr className='hr' />
        </div> 
      )
    });

    const buyers = buyersToDisplay.map( person => {
      return (
        <div key={ person.id }>
          <p>Name: { person.name }</p>
          <p>Phone: { person.phone }</p>
          <p>Address: { person.address }</p>

          <button className='btn' 
                  onClick={ () => { deleteBuyer( person.id ) } }>
            No longer interested
          </button>

          <hr className='hr' />
        </div> 
      )
    });

    return (
      <div className=''>
        <ToastContainer />
        
        <header className='header'>
          <img src={ logo } alt=""/>

          <button className="header-btn1 btn"
                  onClick={ () => resetData( 'vehicles' ) }>
            Reset Vehicles
          </button>

          <button className='header-btn2 btn'
                  onClick={ () => resetData( 'buyers' ) }>
            Reset Buyers
          </button>
      
        </header>

        <div className='btn-container'>
          <button className='btn-sp btn' 
                  onClick={ getVehicles }>
            Get All Vehicles
          </button>

          <select onChange={ filterByMake }
                  ref='selectedMake'
                  className='btn-sp'
                  value="">
            <option value="" disabled>Filter by make</option>
            <option value="Suzuki">Suzuki</option>
            <option value="GMC">GMC</option>
            <option value="Ford">Ford</option>
            <option value="Volkswagen">Volkswagen</option>
            <option value="Chevrolet">Chevrolet</option>
            <option value="Mercedes-Benz">Mercedes-Benz</option>
            <option value="Cadillac">Cadillac</option>
            <option value="Dodge">Dodge</option>
            <option value="Chrysler">Chrysler</option>
          </select>

          <select ref='selectedColor'
                  onChange={ filterByColor }
                  className='btn-sp'
                  value="">
            <option value="" disabled>Filter by color</option>
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="Purple">Purple</option>
            <option value="indigo">Indigo</option>
            <option value="violet">Violet</option>
            <option value="teal">Teal</option>
          </select>

          <input  onChange={ nameSearch }
                  placeholder='Search by name'
                  type="text"
                  ref='searchLetters' />

           <input ref='searchYear'
                  className='btn-sp'
                  type='number'
                  placeholder='Year' />

          <button onClick={ byYear }
                  className='btn-inp'>
            Go
          </button>

          <button className='btn-sp btn'
                  onClick={ getPotentialBuyers }>
            Get Potential Buyers
          </button>
        </div> 

        <br />

        <p id='form' className='form-wrap'>
          <input className='btn-sp' placeholder='make' ref="make" />
          <input className='btn-sp' placeholder='model' ref='model' />
          <input type='number' className='btn-sp' placeholder='year' ref='year' />
          <input className='btn-sp' placeholder='color' ref='color' />
          <input type='number' className='btn-sp' placeholder='price' ref='price' />

          <button className='btn-sp btn'
                  onClick={ addCar }>
            Add vehicle
          </button>
        </p>

        <p className='form-wrap'>
          <input className='btn-sp' placeholder='name' ref='name' />
          <input className='btn-sp' placeholder='phone' ref='phone' />
          <input className='btn-sp' placeholder='address' ref='address' />

          <button onClick={ addBuyer }
                  className='btn-sp btn' >
            Add buyer
          </button>
        </p>
        
        <main className='main-wrapper'>
          <section className='info-box'> 
            <h3>Inventory</h3>

            { vehicles }
          </section>

          <section className='info-box'>
            <h3>Potential Buyers</h3>

            { buyers }
          </section>
        </main>
      </div>
    );
  }
}

export default App;
