class Levels {

    static getLevels() {
        return [
            {
                winScoreLimit: 5,
                imgSource: undefined,
                enemies: [
                    new EnemyType1(),
                    new EnemyType1(this.ctx, 15, 15, 'blue', 300, 600, -3)
                ]
            },
            {
                winScoreLimit: 10,
                imgSource: undefined,
                enemies: [
                    new EnemyType2()
                ]
            },
            {
                winScoreLimit: 15,
                imgSource: undefined,
                enemies: [
                    new EnemyType1(this.ctx, 20, 20, 'orange', 300, 800, -4),
                ]
            }
        ];
    }
}