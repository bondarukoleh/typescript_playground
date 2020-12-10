import {LocalDataSource} from "./data/localDataSource";
import {DomDisplay} from "./domDisplay";
import {HtmlDisplay} from "./htmlDisplay";
import "bootstrap/dist/css/bootstrap.css";

let ds = new LocalDataSource();

async function displayData(): Promise<HTMLElement> {
  /*let display = new DomDisplay();
  display.props = {
    products: await ds.getProducts("name"),
    order: ds.order
  }
  return display.getContent();*/
  let showProduct = new HtmlDisplay();
  showProduct.props = {
    products: await ds.getProducts("name"),
    order: ds.order
  }
  return showProduct.getContent()
}

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    displayData().then(elem => {
      let rootElement = document.getElementById("app");
      rootElement!.innerHTML = "";
      rootElement!.appendChild(elem);
    });
  }
};

displayData().then(res => console.log(res));