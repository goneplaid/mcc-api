const assert = require('assert');
const csvParseSync = require('csv-parse/lib/sync');
const fs = require('fs');
const path = require('path');
const {
  describe, it
} = require('mocha');

parserOptions = {
  delimiter: ':',
  ltrim: true,
  relax_column_count: true,
};

challengeTypes = [
  'A',    // Audition
  'MB',   // Mystery Box
  'EC',   // Elimination Challenge
  'TC',   // Team Challenge
  'PT',   // Pressure Test
  'IC',   // Individual Challenge
  'SF',   // Semi-Final
  'F',    // Finale
]

challengeResults = [
  'IN',
  'WIN',
  'LOS',
  'HIGH',
  'LOW',
  'ELIM',
  'IMM',
]

const selectedSeasonArg = process.argv.find(element => element.split('=')[0] === 'season');
const seasons = selectedSeasonArg ? [Number(selectedSeasonArg.split('=')[1])] : [1, 2, 3, 4, 5, 6, 7, 8, 9];

const toLines = (data) => data.toString().trim().split('\n');
const toCsv = (data) => csvParseSync(file, parserOptions);

describe('Describe challenge data', function() {
  seasons.forEach((season) => {
    describe(`for season ${season}:`, function() {
      beforeEach(function() {
        this.filePath = path.join(__dirname, `../csv/challenges/season-${season}.csv`);
      });

      it('should contain data', function(done) {
        fs.readFile(this.filePath, function(error, data) {
          assert.ok(data && data.length, 'No data was found, wtf!');

          done();
        });
      });

      it('should contain one entry (line) per contestant', function(done) {
        fs.readFile(this.filePath, function(error, challengeData) {
          fs.readFile(path.join(__dirname, `../csv/contestants/season-${season}.csv`), function(error, contestantData) {
            const challengeLines = toLines(challengeData);
            const contestantLines = toLines(contestantData);
            const message = challengeLines.length > contestantLines.length + 1 ? 'Too many entries' : 'Too few entries';

            assert.equal(challengeLines.length, contestantLines.length + 1, message);

            done();
          });
        });
      });

      it('should contain a header with items delimited by a colon (:)', function(done) {
        fs.readFile(this.filePath, function(error, data) {
          const headers = toLines(data)[0].split(':');

          assert.equal(headers[0], 'Place', 'The first header should be "Place"');
          assert.equal(headers[1], 'Contestant', 'The second header should be "Contestant"');

          let episodeCounter = 1;

          // We're essentially counting headers here, making sure they're sequential and starting from one. Sometimes
          // there are multiple challenges per episode, hence the `else if` block below.
          headers.slice(2).forEach((headerItem) => {
            const episodeHeader = Number(headerItem.trim());

            if (episodeHeader == episodeCounter) {
              episodeCounter += 1;
            } else if (episodeHeader == (episodeCounter - 1)) {
              // no-op, everything is just fine, nothing to see here
            } else {
              // we've got a problem here.
              assert.equal(episodeHeader, episodeCounter, "episodes don't start with 1 or aren't sequential");
            }
          });

          done();
        });
      });

      it('should start each line with a contestants finishing place', function(done) {
        fs.readFile(this.filePath, function(error, data) {
          let placeCounter = 1;

          toLines(data).splice(1).forEach((line) => {
            const contestantPlace = Number(line.split(':')[0]);

            if (contestantPlace == placeCounter || contestantPlace == (placeCounter - 1)) {
              placeCounter += 1;
            } else {
              // we've got a problem here.
              assert.equal(contestantPlace, placeCounter, "finishing place(s) are missing or aren't sequential'ish");
            }
          });

          done();
        });
      });

      it('should display a valid contestant name in the second column', function(done) {
        fs.readFile(this.filePath, function(error, challengeData) {
          fs.readFile(path.join(__dirname, `../csv/contestants/season-${season}.csv`), function(error, contestantData) {
            toLines(challengeData).splice(1).forEach((line, index) => {
              assert.equal(line.split(':')[1], toLines(contestantData)[index].split(':')[0], "contestant name wasn't found among contestants")
            });

            done();
          });
        });
      });

      it('every challenge entry must consist of a type and result code', function(done) {
        fs.readFile(this.filePath, function(error, data) {
          toLines(data).splice(1).forEach(line => {
            const challenges = line.split(':').splice(2);

            challenges.forEach((challenge, index) => {
              const challengeParts = challenge.trim().split('-');
              const derp = line;

              assert.equal(challengeParts.length, 2, `Invalid challenge parts for line: "${line}", challenge: ${challengeParts}`);
              assert.ok(challengeTypes.includes(challengeParts[0]), `Challenge type not found: ${challengeParts[0]}`);
              assert.ok(challengeResults.includes(challengeParts[1]), `Challenge result not found: ${challengeParts[1]}`);
            });
          });

          done();
        });
      });
    });
  });
});
