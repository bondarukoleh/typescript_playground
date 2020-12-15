# Creating an Angular App

Some new tsconfig option: \
**importHelpers** - option determines whether helper code is added to the JavaScript to reduce the amount of code that
is produced overall. \
Angular projects are most easily created using the `@angular-cli` package (globally). Angular package names are
prefixed with `@`, it can be official packages from popular libraries.
```shell
ng new angularapp
```

### Understanding TypeScript in Angular Development
Angular depends on TypeScript decorators, to describe the different building blocks used to create web applications.
Like in `app.module.ts` file in the `src/app` folder, and you will see one of the modules that Angular relies on:
```typescript
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
```
Decorators are so important in Angular development that they are applied to classes that contain few or even no members,
just to help define or configure the application. `NgModule` decorator used to describe a group of related features
in the Angular application (Angular modules exist alongside JS modules, this is why this file contains both import
statements and the NgModule decorator). Another example can be seen in the `app.component.ts` file in the `src/app` folder.
```typescript
import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angularapp';
}
```
This is the `Component` decorator, which describes a class that will generate HTML content.

#### Understanding the TypeScript Angular Toolchain
The toolchain for Angular is similar to the previous one, it relies on webpack and the WDS, with customizations
specific to Angular. Angular is using Webpack, but the details of configuration are not exposed directly.
You can see and change the configuration used for the TypeScript compiler because the project is created with
a tsconfig.json file `angularApp/tsconfig.json`. \
`tsconfig.json` should write the compiled JS to `dist/out-tsc` but you won’t see that because webpack is used to
create a bundle automatically. `experimentalDecorators` and `emitDecoratorMetadata` are mandatory fo Angular.

#### Understanding the Two Angular Compilers
There are two compilation stages in an Angular application. The first is where the TS compiler processes TS and emits
pure JS code. This stage is performed each time a file changes. \
TS classes have decorators that specify the HTML and CSS files they depend on, like these dependencies:
```typescript
import {Component} from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html', // here is HTML dependency
  styleUrls: ['./app.component.css'] //  here is CSS dependency
})
export class AppComponent {
  title = 'angularapp';
  names: string[] = ["Bob", "Alice", "Dora"];
}
```
Dependencies resolved during the bundling process, and the files are included in the bundles, with their contents 
encoded as JS strings. The HTML files contain a mix of regular HTML elements and annotations, known as `directives`,
that describe how dynamic content should be generated using the data defined in the corresponding class. \
```html
<!--app.component.html-->
<h4 class="bg-primary text-white text-center p-2">Names</h4>
<ul>
  <li *ngFor="let name of names">
    {{ name }}
  </li>
</ul>
```
An Angular `directive` has been applied to the `li` element. The directive is `ngFor`, and it repeats a section of content
for each data value in a sequence. In this case, the ngFor directive will generate a li item for each value in the names
array. \
Second compilation stage is performed when the bundle received by browser and the JS code it contains is executed. \
During the application startup phase, the HTML files are extracted from the bundle and compiled so that `directives`
are translated into JavaScript statements that can be executed by the browser. \
TS file -> **TS Compiler** -> JS Code (with HTML files) -> Bundler -> Browser -> **Angular compiler** -> HTML Content.

The second Angular compilation stage is performed by the browser every time the application starts, which can introduce
a delay. \
An alternative approach is ahead-of-time (AOT) compilation, which performs the second compilation phase during the
bundling process. With AOT enabled, both compilers are used to create the contents of the bundle, which means that both
the TypeScript and HTML files are compiled into pure JavaScript and no further compilation is required when the bundle
is received by the browser. \
But AOT is not a good choice for all projects because it places [restrictions](https://angular.io/guide/aot-compiler)
on the TypeScript/JavaScript language features. To enable AOT you need angular development tools with --aot argument:
```shell
ng serve --aot
```

### Creating Data Source
Services are one of the key features in Angular development, they allow classes to declare dependencies in their
constructors that are resolved at runtime, a technique known as *dependency injection*. The `DataSource` class declares
a dependency on a `DataSourceImpl` object in its constructor:
```typescript
import { Observable } from "rxjs";
import { Injectable } from '@angular/core';

export type ProductProp = keyof Product;

export abstract class DataSourceImpl {
  abstract loadProducts(): Observable<Product[]>;
  abstract storeOrder(order: Order): Observable<number>;
}
@Injectable()
export class DataSource {
  ...
  constructor(private impl: DataSourceImpl) { }
  ...
```

When a new `DataSource` object is needed, Angular will inspect the constructor, create a `DataSourceImpl` object,
and use it to invoke the constructor to create the new object, a process known as **injection**. \ 
The `Injectable` decorator tells Angular that other classes can declare dependencies on the `DataSource` class.
The `DataSourceImpl` class is abstract, and the DataSource class has no idea which concrete implementation class will
be used to resolve its constructor dependency. The selection of the implementation class is made in the application’s
configuration. \
Angular uses the *Reactive Extensions library*, known as `RxJS`, to manage an automatic updates, allowing changes in data
to be handled automatically. The RxJS `Observable` class is used to describe a sequence of values that will be generated
over time, including asynchronous activities like requesting data from a web service. \
The `loadProducts` method defined by the `DataSourceImpl` class returns an `Observable<Product[]>` object. \
TS generic type argument is used to specify that the result of the `loadProducts` method is an `Observable` object that
will generate a sequence of `Product` array objects. The values generated by an `Observable` object are received
using the subscribe method, like this:
```typescript
this.impl.loadProducts().subscribe(rawData => {
  rawData.forEach(p => {
    this._products.push(p);
    this._categories.add(p.category);
  });
});
```
In this situation, we are using the Observable class as a direct replacement for the standard JavaScript Promise. \
The Observable class provides sophisticated features for dealing with complex sequences, but the advantage here is
that Angular will update the content presented to the user when the `Observable` produces a result, which means that
the rest of the `DataSource` class can be written without needing to deal with `asynchronous` tasks.

class that will be used in `DataSource` since it implements the `DataSourceImpl` abstract:
```typescript
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {DataSourceImpl} from "./dataSource";
import {Product, Order} from "./entities";

@Injectable()
export class RemoteDataSource extends DataSourceImpl {
  constructor(private http: HttpClient) {super();}

  loadProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(urls.products);
  }
  ...
}
```
The `RemoteDataSource` constructor declares a dependency on an instance of the `HttpClient` class, which is the built-in
Angular class. The type argument is used for the **result** from the get method, which is an `Observable` that will
generate a sequence of the specified type, which is `Product[]` in this case. \
The `RxJS` library contains features that can be used to manipulate the values generated by an Observable object:
```typescript
return this.http.post<{ id: number}>(urls.orders, orderData).pipe<number>(map(val => val.id));
```
The `pipe` method is used with the map function to create an `Observable` that generates values based on those from 
another `Observable`. This allows to receive the result from the HTTP POST request and extract just the id property from
the result.

The last step of creating the **data source** is to create an Angular module, which will make the data source available
for use in the rest of the application and **select the implementation** of the abstract **DataSourceImpl** class that
will be used by Angular during the invocation of the `DataSource`.
```typescript
import {NgModule} from "@angular/core";
import {HttpClientModule} from "@angular/common/http";
import {DataSource, DataSourceImpl} from './dataSource';
import {RemoteDataSource} from './remoteDataSource';

@NgModule({
  imports: [HttpClientModule],
  providers: [DataSource, {provide: DataSourceImpl, useClass: RemoteDataSource}]
})
export class DataModelModule {}
```

The `DataModelModule` class is defined just so that the `NgModule` decorator can be applied. `NgModule` properties:
1. `imports` defines the dependencies that the data model classes require;
2. `providers` defines the classes in the Angular module that **can be injected into the constructors** of other classes in
   the application. 
   
For this module, the `imports` property tells Angular that the module that contains the `HttpClient` class is required,
and the `providers` property tells Angular that the `DataSource` class can be used for dependency injection and
that dependencies on the `DataSourceImpl` class should be resolved using the `RemoteDataSource` class.

### Showing the content


