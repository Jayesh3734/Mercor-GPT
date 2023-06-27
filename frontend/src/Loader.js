import Spinner from 'react-bootstrap/Spinner';
import { Container } from 'react-bootstrap';


function Loader(){
        
        return (
            <Container>
            <div style={{
                display:"flex",
                alignItems:"center",
                justifyContent:"center"
            }}>
             <Spinner animation="border" role="status" style={{
                width:"70px",
                height:"70px",
             }}/>
            </div>
            </Container>
        )

}

export default Loader;