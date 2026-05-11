document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contratoForm');
    const pazSalvo = document.getElementById('pazSalvo');
    const valorTotal = document.getElementById('valorTotal');

    // Validación paz-salvo bloqueante
    pazSalvo.addEventListener('change', function() {
        if (this.value !== 'si') {
            this.setCustomValidity('❌ Obligatorio Paz-Salvo Parafiscales/SS (Ley 789/2002)');
            this.style.borderColor = '#e74c3c';
        } else {
            this.setCustomValidity('');
            this.style.borderColor = '#27ae60';
        }
    });

    // Valor >0
    valorTotal.addEventListener('input', function() {
        if (parseFloat(this.value) <= 0) this.setCustomValidity('❌ Valor debe ser positivo');
        else this.setCustomValidity('');
    });

    // Accesibilidad mejorada
    document.querySelectorAll('label').forEach(label => {
        label.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const targetId = label.getAttribute('for');
                document.getElementById(targetId)?.focus();
            }
        });
    });

    form.addEventListener('submit', e => e.preventDefault());
});

function generarContratoProv() {
    const chks = ['chk1', 'chk2', 'chk3', 'chk4'];
    const todosSi = chks.every(id => document.getElementById(id).checked);
    const form = document.getElementById('contratoForm');
    const pazSalvo = document.getElementById('pazSalvo').value;
    const valor = parseFloat(document.getElementById('valorTotal').value);

    if (!form.checkValidity() || !todosSi || pazSalvo !== 'si' || valor <= 0) {
        mostrarMensaje('❌ ERROR: Checklist 100% Sí, Paz-Salvo OBLIGATORIO, Valor >0 (Código Comercio Art.968)', '#e74c3c');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    
    // Header profesional
    doc.setFillColor(243,156,18); doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(255,255,255); doc.setFontSize(22); doc.setFont('helvetica', 'bold');
    doc.text('CONTRATO SUMINISTRO PROVEEDORES - 2026', 20, 20);

    // Contenido
    doc.setFontSize(12); doc.setTextColor(50,50,50); doc.setFont('helvetica', 'normal');
    let y = 40;
    doc.text(`Contratante: ${document.getElementById('nomContratante').value} NIT ${document.getElementById('nitContratante').value}`, 20, y); y+=10;
    doc.text(`Proveedor: ${document.getElementById('nomProv').value} NIT/CC ${document.getElementById('nitProv').value}`, 20, y); y+=10;
    doc.text(`Objeto: ${document.getElementById('objeto').value.substring(0,100)}...`, 20, y); y+=10;
    doc.text(`Valor: $${valor.toLocaleString()} | Cantidad: ${document.getElementById('cantidad').value} | Entrega: ${document.getElementById('plazoEnt').value}`, 20, y); y+=10;
    doc.text(`Pago: ${document.getElementById('formaPago').value} Cuenta: ${document.getElementById('cuentaBanc').value}`, 20, y); y+=10;
    doc.text(`Docs: RUT ${document.getElementById('rutProv').value} | Matrícula ${document.getElementById('matricula').value} | Paz-Salvo ✓`, 20, y); y+=12;
    
    doc.setFont('helvetica', 'bold'); doc.setTextColor(243,156,18); doc.text('CHECKLIST LEGAL 100% | PENALIDAD 1% MORA | JURISDICCIÓN META', 20, y); y+=12;
    doc.setFont('helvetica', 'normal'); doc.setTextColor(50,50,50);
    doc.text('Firmas:', 20, y+=12);
    doc.text('Contratante: __________________________________ Fecha: _______________', 20, y+=10);
    doc.text('Proveedor: ____________________________________ Fecha: _______________', 20, y+=10);
    doc.text('Testigos: 1. ________________ CC: ______ 2. ________________ CC: ______', 20, y+=10);

    const nombreArchivo = `contrato-proveedor-${document.getElementById('nomProv').value.replace(/[^a-zA-Z0-9]/g, '_')}_2026.pdf`;
    doc.save(nombreArchivo);

    mostrarMensaje('✅ ¡PDF Mercantil Generado! Verifica paz-salvo, firma y archiva Cámara Comercio.', '#27ae60');
}

function mostrarMensaje(texto, color) {
    const msg = document.getElementById('mensaje');
    msg.innerHTML = `<span>${texto}</span>`;
    msg.style.background = color;
    msg.style.color = 'white';
    msg.style.display = 'flex';
    msg.style.border = `4px solid ${color === '#27ae60' ? '#229954' : '#c0392b'}`;
    msg.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
    setTimeout(() => msg.style.display = 'none', 7000);
}
