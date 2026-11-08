import {MemoryRouter} from 'react-router-dom';
import {renderToString} from 'react-dom/server';
import {Provider} from '../src/store';
import App from '../src/App';
export function renderPath(path:string){return renderToString(<MemoryRouter initialEntries={[path]}><Provider><App/></Provider></MemoryRouter>)}
