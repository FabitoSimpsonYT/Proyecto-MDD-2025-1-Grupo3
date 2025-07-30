import Cuenta from '../entity/cuenta.entity.js';
import { AppDataSource } from '../config/configDb.js';

export async function createCuentasDemo() {
  try {
    const cuentaRepository = AppDataSource.getRepository(Cuenta);
    const count = await cuentaRepository.count();
    if (count > 0) return;
    const cuentas = [
      {
        nombre: 'Administrador',
        rut: '12345678-9',
        saldo: 20000
      },
      {
        nombre: 'Usuario',
        rut: '98765432-1',
        saldo: 15000
      }
    ];
    for (const cuenta of cuentas) {
      await cuentaRepository.save(cuentaRepository.create(cuenta));
    }
    console.log('Cuentas demo creadas.');
  } catch (error) {
    console.error('Error al crear cuentas demo:', error);
  }
}
