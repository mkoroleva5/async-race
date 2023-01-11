import { createHeader } from './components/header/header';
import './style.css';

const body = document.querySelector('body') as HTMLBodyElement;
const header = createHeader();

body.appendChild(header);
