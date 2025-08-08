# Comando para compilar imagen de tina
    sudo docker build -t manual-portal-cms-tina --network=host . 

"dev": "TINA_PUBLIC_IS_LOCAL=true tinacms dev -c \"next dev\"",