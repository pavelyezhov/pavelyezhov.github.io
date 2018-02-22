import EnemyType1 from './settings/EnemyType1';
import EnemyType2 from './settings/EnemyType2';

class Levels {

    static getLevels() {
        return [
            {
                winScoreLimit: 50,
                imgSource: undefined,
                enemies: [
                    new EnemyType1(),
                    new EnemyType1(this.ctx, 15, 15, 'blue', 300, 600, -3)
                ]
            },
            {
                winScoreLimit: 60,
                imgSource: undefined,
                enemies: [
                    new EnemyType2()
                ]
            },
            {
                winScoreLimit: 70,
                imgSource: undefined,
                enemies: [
                    new EnemyType1(this.ctx, 20, 20, 'orange', 300, 800, -4),
                ]
            }
        ];
    }
}

export default Levels;