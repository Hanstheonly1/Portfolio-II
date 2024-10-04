# Tic Tac Toe Assignment

Everything you need to complete this assignment is demonstrated in the provided code. You are to make the following changes:

1. Evaluate diagonal wins (currently, the code only evaluates orthogonal wins).
2. Evaluate for draw (i.e there are no more open cells and nobody has three in a row).
3. Remove all magic strings and numbers.
4. Support at least two languages.
5. Refactor and add code so that the player can change the game language via the menu -> settings.
6. Implement the necessary changes and additions to support Player vs Computer mode.  
   The current game is PvP (Player vs Player), but we want a functional Player vs Computer mode (accessed via the menu). The computer player you implement does not need to be smart, just functional. Note that there should still be a PvP mode, with PvC as an additional option.
7. Improve the gameboard's appearance and use colors for players (see `img1.png` for inspiration).
8. The player should not need to count from 0 in order to play (i.e. uper left hand corner should be 1 1 and center should be 2 2 for the player)
9. Update the splash screen graphics and include at least three colors.
10. Improve overall readability and maintainability by refactoring

Remember to solve one thing at a time: start by understanding the problem, make it work, then make it "pretty".   
If you create a bug, do not move on to something new, stick with it. Chances are, if you don't, you'll just create another bug elsewhere in the code, making it more complex to fix.


# "Harder" (Extra) Challenges
These are optional, and you should only attempt them once you've completed the other challenges. Solving them may require additional research. Do one, do all, or none at all—it's completely your decision.

* Remember the language choice between sessions (i.e., across restarts of the program).
* Center the splash screen graphics in the terminal window (Hint: `process.stdout.columns`).
* Implement the Minimax algorithm for your computer player.