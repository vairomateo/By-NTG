export async function cargarProductos() {

    try {

        const response = await fetch("./productos.json");

        const data =
            await response.json();

        return data.productos;

    } catch (error) {

        Swal.fire({
            icon: "error",
            title: "Error cargando productos"
        });

        return [];
    }
}

export function filtrarProductos(
    productos,
    texto,
    categoria
) {

    let resultado = [...productos];

    if (texto.trim() !== "") {

        resultado = resultado.filter(
            producto =>
                producto.nombre
                    .toLowerCase()
                    .includes(
                        texto.toLowerCase()
                    )
        );
    }

    if (categoria !== "todos") {

        resultado = resultado.filter(
            producto =>
                producto.categoria === categoria
        );
    }

    return resultado;
}