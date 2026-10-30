import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  precio: number;
  existencias: number;
}

@Component({
  selector: 'app-producto',
  imports: [FormsModule],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent {
  productos: Producto[] = [];

  // Formulario
  codigo = '';
  nombre = '';
  precio: number | null = null;
  existencias: number | null = null;

  constructor(private router: Router) {
    if (localStorage.getItem('sesionTienda') !== 'si') {
      this.router.navigate(['/login']);
      return;
    }
    const datos = localStorage.getItem('productosTienda');
    if (datos !== null) {
      this.productos = JSON.parse(datos);
    }
  }

  cerrarSesion() {
    localStorage.removeItem('sesionTienda');
    this.router.navigate(['/login']);
  }

  guardar() {
    if (
      this.codigo.trim() === '' ||
      this.nombre.trim() === '' ||
      this.precio === null ||
      this.existencias === null
    ) {
      alert('Complete todos los campos obligatorios.');
      return;
    }

    if (this.precio <= 0) {
      alert('El precio debe ser un número mayor que cero.');
      return;
    }

    if (!Number.isInteger(this.existencias) || this.existencias < 0) {
      alert('Las existencias deben ser un número entero mayor o igual a cero.');
      return;
    }

    let nuevoId = 1;
    for (const producto of this.productos) {
      if (producto.id >= nuevoId) {
        nuevoId = producto.id + 1;
      }
    }

    const nuevoProducto: Producto = {
      id: nuevoId,
      codigo: this.codigo.trim(),
      nombre: this.nombre.trim(),
      precio: Number(this.precio),
      existencias: Number(this.existencias)
    };

    this.productos.push(nuevoProducto);
    this.guardarEnLocalStorage();
    this.limpiar();
  }

  limpiar() {
    this.codigo = '';
    this.nombre = '';
    this.precio = null;
    this.existencias = null;
  }

  guardarEnLocalStorage() {
    localStorage.setItem('productosTienda', JSON.stringify(this.productos));
  }
}