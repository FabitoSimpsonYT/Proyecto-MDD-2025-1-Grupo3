import Pago from '../entity/pago.entity.js';
import Cuenta from '../entity/cuenta.entity.js';
import { AppDataSource } from '../config/configDb.js';

export async function createPagosDemo() {
  try {
    const pagoRepository = AppDataSource.getRepository(Pago);
    const cuentaRepository = AppDataSource.getRepository(Cuenta);

    const cuentas = await cuentaRepository.find();
    if (!cuentas.length) return;

    // Solo si no hay pagos
    const count = await pagoRepository.count();
    if (count > 0) return;

    const pagos = [
      {
        cuentaId: cuentas[0].id,
        monto: 10000,
        metodo: 'transferencia',
        voucher: 'demo1.pdf',
        estado: 'confirmado',
        observacion: 'Pago inicial',
        tipo: 'general',
      },
      {
        cuentaId: cuentas[1]?.id || cuentas[0].id,
        monto: 5000,
        metodo: 'efectivo',
        voucher: null,
        estado: 'pendiente',
        observacion: 'Pago en efectivo',
        tipo: 'extra',
      },
    ];

    for (const pago of pagos) {
      await pagoRepository.save(pagoRepository.create(pago));
    }
    console.log('Pagos demo creados.');
  } catch (error) {
    console.error('Error al crear pagos demo:', error);
  }
}
