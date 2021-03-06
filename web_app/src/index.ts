import {RemoteDataSource} from "./data/remoteDataSource";
import {HtmlDisplay} from "./components/htmlDisplay";
import "bootstrap/dist/css/bootstrap.css";

enum DisplayMode {
  List, Details, Complete
}

let ds = new RemoteDataSource();

async function displayData(): Promise<HTMLElement> {
  let showProduct = new HtmlDisplay();
  showProduct.props = {
    dataSource: ds,
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