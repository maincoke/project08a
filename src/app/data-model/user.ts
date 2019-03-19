import { Product } from './product';
import { Creds } from './creds';
export class User {
  public namesusr: string;
  public credsusr: Creds;
  public shopcar: Product[];
  public orderusr: number[];
}
