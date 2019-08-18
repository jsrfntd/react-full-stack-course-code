/*
  eslint-disable react/prefer-stateless-function, react/jsx-boolean-value,
  no-undef, jsx-a11y/label-has-for
*/

/*
  eslint-disable react/prefer-stateless-function, react/jsx-boolean-value,
  no-undef, jsx-a11y/label-has-for
*/

//It is the higher component in hierarchy which is reponsable to render his child components
class TimersDashboard extends React.Component {
    state = {
        timers: [
            {
                title: 'Practice squat',
                project: 'Gym Chores',
                id: uuid.v4(),
                elapsed: 5456099,
                runningSince: Date.now()
            },
            {
                title: 'Bake squash',
                project: 'Kitchen Chores',
                id: uuid.v4(),
                elapsed: 1273998,
                runningSince: null,
            },
        ],
    };
    render(){
        return (
            <div className='ui three column centered grid'>
                <div className='column'>
                    <EditableTimerList
                        timers={this.state.timers}
                    />
                    <ToggleableTimerForm/>
                </div>
            </div>
        );
    }
}

//Editable components list
class EditableTimerList extends React.Component {
    render() {
        const timers = this.props.timers.map( (timer) => (
                <EditableTimer
                    key={timer.id}
                    id={timer.id}
                    title={timer.title}
                    project={timer.project}
                    elapsed={timer.elapsed}
                    runningSince={timer.runningSince}
                />
            )
        );
        return (
            <div id='timers'>
                {timers}
            </div>
        );
    }
}

//Component that manages the "Timer" component visualization logic and his form edition.
class EditableTimer extends React.Component{
    state = {
        editFormOpen: false,
    };
    render(){
        if(this.props.editFormOpen){
            return(
                <TimerForm
                    title={this.props.title}
                    project={this.props.project}
                />
            );
        }else{
            return(
                <Timer
                    title={this.props.title}
                    project={this.props.project}
                    elapsed={this.props.elapsed}
                    runningSince={this.props.runningSince}
                />
            );
        }
    }
}

//Componente para la edicion de un timer
class TimerForm extends React.Component {
    state = {
        title: this.props.title || '',
        project: this.props.project || '',
    };
    render() {
        const submitText = this.props.title ? 'Create' : 'Update';
        handleTitleChange = (e) => {
            this.setState({title: e.target.value})
        };
        handleProjectChange = (e) => {
            this.setState({project: e.target.value})
        };
        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='ui form'>
                        <div className='field'>
                            <label>Title</label>
                            <input type='text'
                                   value={this.props.title}
                                   onChange={this.handleTitleChange}
                            />
                        </div>
                        <div className='field'>
                            <label>Project</label>
                            <input type='text'
                                   value={this.props.project}
                                   onChange={this.handleProjectChange}
                            />
                        </div>
                        <div className='ui two bottom attached buttons'>
                            <button className='ui basic blue button'>
                                {submitText}
                            </button>
                            <button className='ui basic red button'>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

//Componente que maneja la logica de renderizado del boton inferior para agregar un
//elemento a la lista y el formulario de agregacion.
class ToggleableTimerForm extends React.Component{
    state = {
        isOpen: false,
    };

    //En esta forma react hace automaticamente el bind de la funcion de lo contrario la
    //notacion deberia ser la sigueinte:

    // handleFormOpen() {
    //     this.setState({ isOpen: true });
    // }

    // constructor(props) {
    //     super(props);
    //     this.handleFormOpen = this.handleFormOpen.bind(this);
    // }
    //Funcion para modificar la variable que controla el renderizado del formulario
    handleFormOpen = () => {
        this.setState({isOpen: true});
    }

    //Renderizado del componente con base a un condicional controlado por la variable isOpen
    render(){
        if(this.props.isOpen){
            return (
                <TimerForm />
            );
        }else{
            return(
                <div className='ui two bottom attached buttons'>
                    <button className='ui basic button icon'
                            onClick={this.handleFormOpen}>
                        <i className='plus icon' />
                    </button>
                </div>
            );
        }
    }
}


class Timer extends React.Component {
    render() {
        const elapsedString = helpers.renderElapsedString(this.props.elapsed);
        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='header'>
                        {this.props.title}
                    </div>
                    <div className='meta'>
                        {this.props.project}
                    </div>
                    <div className='center aligned description'>
                        <h2>
                            {elapsedString}
                        </h2>
                    </div>
                    <div className='extra content'>
                        <span className='right floated edit icon'>
                            <i className='edit icon' />
                        </span>
                        <span className='right floated trash icon'>
                            <i className='trash icon' />
                        </span>
                    </div>
                </div>
                <div className='ui bottom attached blue basic button'>
                    Start
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <TimersDashboard />,
    document.getElementById('content')
);