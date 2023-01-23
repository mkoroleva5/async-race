import { EventObserver } from '../utils/observer';
import { Car, Winner } from './api';

interface Winners {
  items: ({ car: Car } & Winner)[];
  count: number;
}

export type SortBy = 'id' | 'wins' | 'time';
export type SortOrder = 'ASC' | 'DESC';
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

  _winners: Winners = { items: [], count: 0 };

  get winners(): Winners {
    return this._winners;
  }

  set winners(value: Winners) {
    this._winners = value;
    this.broadcast(this);
  }

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

  sortBy: SortBy = 'id';

  sortOrder: SortOrder = 'ASC';

  private _count = 0;

  get count() {
    return this._count;
  }

  set count(value) {
    this._count = value;
    this.broadcast(this);
  }

  private _animation = false;

  get animation() {
    return this._animation;
  }

  set animation(value) {
    this._animation = value;
    this.broadcast(this);
  }
}

export const state = new State();
