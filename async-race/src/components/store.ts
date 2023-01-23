import { EventObserver } from '../utils/observer';
import { Car, Winner } from './api';

export class State extends EventObserver<State> {
  cars: Car[] = [];

  page = 1;

  totalPages = 1;

  _currentWinner: { winner: Car | undefined; time: number } | undefined = undefined;

  get currentWinner(): { winner: Car | undefined; time: number } | undefined {
    return this._currentWinner;
  }

  set currentWinner(value: { winner: Car | undefined; time: number } | undefined) {
    this._currentWinner = value;
    this.broadcast(this);
  }

  winners: {
    items: { car: void; id: number; name: string; color: string }[];
    count: number;
  } = { items: [], count: 0 };

  winnersPage = 1;

  winnersCount = 0;

  view = 'garage';

  private _selectedCar: Car | null = null;

  get selectedCar(): Car | null {
    return this._selectedCar;
  }

  set selectedCar(value: Car | null) {
    this._selectedCar = value;
    this.broadcast(this);
  }

  sortBy = 'id';

  sortOrder = 'ASC';

  private _count = 0;

  get count() {
    return this._count;
  }

  set count(value) {
    this._count = value;
    this.broadcast(this);
  }
}

export const state = new State();
